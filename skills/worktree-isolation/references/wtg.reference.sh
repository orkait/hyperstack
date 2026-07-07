#!/usr/bin/env bash
# wtg.reference.sh - bind parallel worktrees of one feature across separate repos,
# with per-group port slots + OAuth-safe run scripts. Reference implementation for
# the "Multi-Repo Feature Groups" pattern (see multi-repo-feature-groups.md).
#
# Stack-agnostic: roles are arbitrary and every stack-specific behaviour lives in
# the CONFIG block as data. The implementation below knows nothing about any
# particular language, framework, or service.
#
# INSTALL: copy this file, edit the CONFIG block, then in your shell rc:
#   source /path/to/wtg.reference.sh      (requires bash 4+ for associative arrays)
# See SETUP.md for full setup (statusline, settings.json, quickstart).

# ============================================================================
# CONFIG - EDIT FOR YOUR STACK. Roles are yours to name; nothing below assumes any.
# ============================================================================
WTG_FILE="${WTG_FILE:-$HOME/.config/wtg/worktree-groups.tsv}"  # registry location
WTG_WORKROOT="${WTG_WORKROOT:-$HOME/work}"                     # where worktrees are created
WTG_BASE_BRANCH="${WTG_BASE_BRANCH:-origin/main}"             # branch new worktrees fork from

# The roles a feature can span. One role = one repo. Order is cosmetic.
WTG_ROLES=(api web)

# role -> main-checkout path of that role's repo.
declare -A WTG_REPO=(
    [api]="$HOME/work/api"
    [web]="$HOME/work/web"
)

# role -> base port. Final port = base + 10 * slot (so groups never collide).
declare -A WTG_PORT=(
    [api]=8080
    [web]=3000
)

# role -> launch command written into dev.sh. Placeholders substituted at generation:
#   %PORT%         this member's port for the group's slot
#   %PRIMARY_PORT% the primary role's port (e.g. a frontend pointing at its backend)
#   %OAUTH_PORT%   the OAuth-registered port
declare -A WTG_RUN=(
    [api]='SERVER_PORT=%PORT% go run ./cmd/server'
    [web]='VITE_API_URL=http://localhost:%PRIMARY_PORT% npm run dev -- --port %PORT%'
)

# role -> space-separated relative env files to seed with `wtg env`. Default ".env".
declare -A WTG_ENV=(
    [web]="apps/web/.env"
)

WTG_PRIMARY_ROLE="api"   # the OAuth-bearing role; also the tree `wtg go` opens in
WTG_OAUTH_PORT=8080      # the port your OAuth redirect_uris are registered against
WTG_OAUTH_VARS="PUBLIC_BASE_URL OAUTH_REDIRECT_URL"   # host:port URLs to port-swap for the primary role
# ============================================================================
# END CONFIG. Generic, stack-agnostic implementation below - no need to edit.
# ============================================================================

_wtg_repo() { echo "${WTG_REPO[$1]}"; }
_wtg_port() { local base=${WTG_PORT[$1]:-9000}; echo $(( base + ${2:-0} * 10 )); }
_wtg_primary_port() { _wtg_port "$WTG_PRIMARY_ROLE" "$1"; }

# reponame -> role (reverse of WTG_REPO), for binding a worktree without an explicit role
_wtg_role() {
    local r
    for r in "${WTG_ROLES[@]}"; do
        [ "$(basename "${WTG_REPO[$r]}")" = "$1" ] && { echo "$r"; return; }
    done
    echo "$1"
}

_wtg_next_slot() {
    awk -F'\t' 'NF>=4 && $4!=""{used[$4]=1} END{ s=0; while (used[s]) s++; print s }' "$WTG_FILE" 2>/dev/null || echo 0
}
_wtg_group_slot() { awk -F'\t' -v g="$1" '$1==g && NF>=4 && $4!=""{print $4; exit}' "$WTG_FILE" 2>/dev/null; }
_wtg_group_at_slot() { awk -F'\t' -v s="$1" 'NF>=4 && $4==s{print $1; exit}' "$WTG_FILE" 2>/dev/null; }

# generic dev.sh: substitutes the role's run command, and for the primary role
# emits the OAuth port-swap prelude. No role names are special-cased.
_wtg_write_devsh() {  # role path port grp slot
    local role=$1 path=$2 port=$3 grp=$4 slot=$5 f="$2/dev.sh" run pport
    pport=$(_wtg_primary_port "$slot")
    run=${WTG_RUN[$role]:-"echo 'wtg: no run command configured for role $role (port $port)'"}
    run=${run//%PORT%/$port}; run=${run//%PRIMARY_PORT%/$pport}; run=${run//%OAUTH_PORT%/$WTG_OAUTH_PORT}
    {
        echo '#!/usr/bin/env bash'
        echo "# wtg: role '$role' for group '$grp' (slot $slot) on :$port."
        if [ "$role" = "$WTG_PRIMARY_ROLE" ] && [ "$slot" -ne 0 ]; then
            echo "#"
            echo "# WARNING slot $slot: :$port is NOT the OAuth-registered port ($WTG_OAUTH_PORT)."
            echo "# Provider redirect_uri will mismatch; OAuth flows fail here. Use: wtg claim-oauth $grp"
        fi
        echo 'cd "$(dirname "$0")" || exit 1'
        if [ "$role" = "$WTG_PRIMARY_ROLE" ] && [ -n "$WTG_OAUTH_VARS" ]; then
            echo "_g(){ grep -E \"^\$1=\" .env 2>/dev/null | head -1 | cut -d= -f2-; }"
            echo "for v in $WTG_OAUTH_VARS; do cur=\"\$(_g \"\$v\")\"; [ -n \"\$cur\" ] && export \"\$v=\${cur/:$WTG_OAUTH_PORT/:$port}\"; done"
        fi
        echo "exec $run"
    } > "$f"
    chmod +x "$f"
}

_wtg_dedup() {
    [ -f "$WTG_FILE" ] || return 0
    awk -F'\t' -v p="$1" '$3!=p' "$WTG_FILE" > "$WTG_FILE.tmp" && mv "$WTG_FILE.tmp" "$WTG_FILE"
}
_wtg_bind() { mkdir -p "$(dirname "$WTG_FILE")"; touch "$WTG_FILE"; _wtg_dedup "$3"; printf '%s\t%s\t%s\t%s\n' "$1" "$2" "$3" "$4" >> "$WTG_FILE"; }
_wtg_group_exists() { awk -F'\t' -v g="$1" '$1==g{f=1} END{exit !f}' "$WTG_FILE" 2>/dev/null; }

_wtg_add_member() {  # group role slot branch
    local grp=$1 role=$2 slot=$3 branch=$4 repo path port
    repo=$(_wtg_repo "$role")
    { [ -z "$repo" ] || [ ! -d "$repo" ]; } && { echo "  ! $role: no repo ($repo) — check WTG_REPO — skipped"; return 1; }
    path="$WTG_WORKROOT/$grp-$role"
    [ -e "$path" ] && { echo "  ! $role: $path exists — skipped"; return 1; }
    git -C "$repo" fetch origin --quiet 2>/dev/null
    if git -C "$repo" worktree add "$path" -b "$branch" "$WTG_BASE_BRANCH" >/dev/null 2>&1 \
       || git -C "$repo" worktree add "$path" "$branch" >/dev/null 2>&1; then
        _wtg_bind "$grp" "$role" "$path" "$slot"
        if [ -n "$slot" ]; then
            port=$(_wtg_port "$role" "$slot"); _wtg_write_devsh "$role" "$path" "$port" "$grp" "$slot"
            echo "  + $role  :$port  $path  (dev.sh)"
        else echo "  + $role  $path  (bound, no slot)"; fi
    else echo "  ! $role: git worktree add failed — skipped"; return 1; fi
}

_wtg_regen_group() {  # group newslot
    local grp=$1 newslot=$2 role path
    while IFS=$'\t' read -r g role path _; do
        [ "$g" = "$grp" ] || continue
        [ -d "$path" ] && _wtg_write_devsh "$role" "$path" "$(_wtg_port "$role" "$newslot")" "$grp" "$newslot"
    done < "$WTG_FILE"
    awk -F'\t' -v g="$grp" -v s="$newslot" 'BEGIN{OFS="\t"} $1==g{$4=s} {print}' "$WTG_FILE" > "$WTG_FILE.tmp" && mv "$WTG_FILE.tmp" "$WTG_FILE"
}

_wtg_run_dir() { echo "${XDG_RUNTIME_DIR:-$HOME/.cache}/wtg-run/$1"; }
_wtg_copy_env() {  # src dst force
    local src=$1 dst=$2 force=$3
    [ -f "$src" ] || { echo "  ! no base env at $src (skipped)"; return 0; }
    [ "$src" = "$dst" ] && return 0
    if [ -f "$dst" ] && [ -z "$force" ]; then echo "  = $dst exists (use --force)"; return 0; fi
    mkdir -p "$(dirname "$dst")" && cp "$src" "$dst" && echo "  + seeded $dst"
}

wtg() {
    local top repo role grp slot port path branch other src_repo force rel

    case "$1" in
        new)
            grp=$2; shift 2 2>/dev/null
            { [ -z "$grp" ] || [ $# -eq 0 ]; } && { echo "usage: wtg new <group> <role...>  (roles: ${WTG_ROLES[*]})"; return 1; }
            _wtg_group_exists "$grp" && { echo "wtg: group '$grp' already exists — use 'wtg add $grp <role...>'"; return 1; }
            branch="feat/$grp"; slot=$(_wtg_next_slot)
            echo "wtg new: group '$grp' -> slot $slot, branch $branch"
            for role in "$@"; do _wtg_add_member "$grp" "$role" "$slot" "$branch"; done
            [ "$slot" -ne 0 ] && echo "note: slot $slot is offset — OAuth needs 'wtg claim-oauth $grp'"
            echo "run:  wtg up $grp"
            ;;
        add)
            grp=$2; shift 2 2>/dev/null
            { [ -z "$grp" ] || [ $# -eq 0 ]; } && { echo "usage: wtg add <group> <role...>"; return 1; }
            _wtg_group_exists "$grp" || { echo "wtg add: no group '$grp' — use 'wtg new $grp <role...>'"; return 1; }
            branch="feat/$grp"; slot=$(_wtg_group_slot "$grp")
            echo "wtg add: -> group '$grp'${slot:+ (slot $slot)}, branch $branch"
            for role in "$@"; do _wtg_add_member "$grp" "$role" "$slot" "$branch"; done
            ;;
        env)
            grp=$2; force=""; [ "$3" = "--force" ] && force=1
            [ -z "$grp" ] && { echo "usage: wtg env <group> [--force]"; return 1; }
            _wtg_group_exists "$grp" || { echo "wtg env: no group '$grp'"; return 1; }
            echo "wtg env: seeding base env into '$grp' worktrees${force:+ (force)}"
            while IFS=$'\t' read -r g role path _; do
                [ "$g" = "$grp" ] || continue
                [ -d "$path" ] || { echo "  ! $role: worktree missing ($path)"; continue; }
                src_repo=$(_wtg_repo "$role"); [ -d "$src_repo" ] || { echo "  ! $role: no source repo"; continue; }
                for rel in ${WTG_ENV[$role]:-.env}; do _wtg_copy_env "$src_repo/$rel" "$path/$rel" "$force"; done
            done < "$WTG_FILE"
            ;;
        up)
            grp=$2
            [ -z "$grp" ] && { echo "usage: wtg up <group>"; return 1; }
            _wtg_group_exists "$grp" || { echo "wtg up: no group '$grp'"; return 1; }
            local -a _mrole _mpath; local i session rd
            while IFS=$'\t' read -r g role path _; do
                [ "$g" = "$grp" ] || continue
                [ -x "$path/dev.sh" ] || { echo "  ! $role: no dev.sh in $path (run 'wtg new/add')"; continue; }
                _mrole+=("$role"); _mpath+=("$path")
            done < "$WTG_FILE"
            [ ${#_mpath[@]} -eq 0 ] && { echo "wtg up: no runnable members"; return 1; }
            if command -v tmux >/dev/null 2>&1; then
                session="wtg-$grp"
                tmux has-session -t "$session" 2>/dev/null && { echo "wtg up: already up — tmux attach -t $session"; return 0; }
                for i in "${!_mpath[@]}"; do
                    if [ "$i" = 0 ]; then tmux new-session -d -s "$session" -n "${_mrole[$i]}" "cd '${_mpath[$i]}' && ./dev.sh; exec ${SHELL:-bash}"
                    else tmux new-window -t "$session" -n "${_mrole[$i]}" "cd '${_mpath[$i]}' && ./dev.sh; exec ${SHELL:-bash}"; fi
                done
                echo "wtg up: '$grp' -> ${#_mpath[@]} tmux windows. Attach: tmux attach -t $session"
            else
                rd=$(_wtg_run_dir "$grp"); mkdir -p "$rd"
                for i in "${!_mpath[@]}"; do
                    ( cd "${_mpath[$i]}" && nohup ./dev.sh > "$rd/${_mrole[$i]}.log" 2>&1 & echo $! > "$rd/${_mrole[$i]}.pid" )
                    echo "  + ${_mrole[$i]} pid $(cat "$rd/${_mrole[$i]}.pid" 2>/dev/null)  log $rd/${_mrole[$i]}.log"
                done
                echo "wtg up: '$grp' in background (no tmux). Stop: wtg down $grp"
            fi
            ;;
        down)
            grp=$2
            [ -z "$grp" ] && { echo "usage: wtg down <group>"; return 1; }
            local stopped=0 rd pf pid
            if command -v tmux >/dev/null 2>&1 && tmux has-session -t "wtg-$grp" 2>/dev/null; then
                tmux kill-session -t "wtg-$grp"; echo "wtg down: killed tmux session wtg-$grp"; stopped=1
            fi
            rd=$(_wtg_run_dir "$grp")
            if [ -d "$rd" ]; then
                for pf in "$rd"/*.pid; do
                    [ -f "$pf" ] || continue
                    pid=$(cat "$pf"); kill "$pid" 2>/dev/null && echo "  killed $(basename "$pf" .pid) (pid $pid)"; rm -f "$pf"; stopped=1
                done
            fi
            [ "$stopped" = 0 ] && echo "wtg down: nothing running for '$grp'"
            ;;
        st)
            grp=$2
            if [ -z "$grp" ]; then
                top=$(git rev-parse --show-toplevel 2>/dev/null)
                grp=$(awk -F'\t' -v p="$top" '$3==p{print $1; exit}' "$WTG_FILE" 2>/dev/null)
                [ -z "$grp" ] && { echo "usage: wtg st <group>"; return 1; }
            fi
            _wtg_group_exists "$grp" || { echo "wtg st: no group '$grp'"; return 1; }
            local br dirty sync ab p
            echo "group: $grp"
            printf "  %-6s %-30s %-6s %-9s %s\n" role branch state ahead/beh port
            while IFS=$'\t' read -r g role path slot; do
                [ "$g" = "$grp" ] || continue
                if [ -d "$path" ]; then
                    br=$(git -C "$path" symbolic-ref --short HEAD 2>/dev/null || git -C "$path" rev-parse --short HEAD 2>/dev/null || echo '?')
                    if git -C "$path" diff --quiet 2>/dev/null && git -C "$path" diff --cached --quiet 2>/dev/null; then dirty=clean; else dirty=DIRTY; fi
                    ab=$(git -C "$path" rev-list --left-right --count HEAD...@{upstream} 2>/dev/null)
                    if [ -n "$ab" ]; then sync="+${ab%%[[:space:]]*}/-${ab##*[[:space:]]}"; else sync=-; fi
                else br='(missing)'; dirty=-; sync=-; fi
                p=-; [ -n "$slot" ] && p=":$(_wtg_port "$role" "$slot")"
                printf "  %-6s %-30s %-6s %-9s %s\n" "$role" "$br" "$dirty" "$sync" "$p"
            done < "$WTG_FILE"
            ;;
        claim-oauth)
            grp=$2
            [ -z "$grp" ] && { echo "usage: wtg claim-oauth <group>"; return 1; }
            [ -z "$(_wtg_group_slot "$grp")" ] && { echo "wtg: '$grp' has no slot; nothing to claim"; return 1; }
            [ "$(_wtg_group_slot "$grp")" = "0" ] && { echo "wtg: '$grp' already on :$WTG_OAUTH_PORT"; return 0; }
            slot=$(_wtg_group_slot "$grp"); other=$(_wtg_group_at_slot 0)
            if [ -n "$other" ] && [ "$other" != "$grp" ]; then
                _wtg_regen_group "$other" "$slot"; echo "wtg: moved '$other' off :$WTG_OAUTH_PORT -> slot $slot (restart it)"
            fi
            _wtg_regen_group "$grp" 0
            echo "wtg: '$grp' now on :$WTG_OAUTH_PORT — OAuth works. Restart its stack."
            ;;
        go)
            local -a _groups adddirs; local primary launcher="${WTG_LAUNCHER:-claude}"
            grp=$2
            [ -f "$WTG_FILE" ] || { echo "wtg go: no groups yet"; return 1; }
            if [ -z "$grp" ]; then
                [ -t 0 ] || { echo "wtg go: need a terminal for the menu, or pass a group"; return 1; }
                mapfile -t _groups < <(awk -F'\t' '!seen[$1]++{print $1}' "$WTG_FILE")
                [ ${#_groups[@]} -eq 0 ] && { echo "wtg go: no groups yet"; return 1; }
                wtg ls; echo; echo "which feature-set?"
                select grp in "${_groups[@]}"; do [ -n "$grp" ] && break; done
                [ -z "$grp" ] && { echo "wtg go: cancelled"; return 1; }
            fi
            while IFS=$'\t' read -r g role path _; do
                [ "$g" = "$grp" ] || continue
                [ -d "$path" ] || { echo "wtg go: $role path missing: $path (skipped)"; continue; }
                if [ -z "$primary" ] && [ "$role" = "$WTG_PRIMARY_ROLE" ]; then primary="$path"; else adddirs+=("$path"); fi
            done < "$WTG_FILE"
            if [ -z "$primary" ] && [ ${#adddirs[@]} -gt 0 ]; then primary="${adddirs[0]}"; adddirs=("${adddirs[@]:1}"); fi
            [ -z "$primary" ] && { echo "wtg go: group '$grp' has no live worktrees"; return 1; }
            echo "wtg go: '$grp' -> $primary${adddirs:+   +add-dir: ${adddirs[*]}}"
            if [ ${#adddirs[@]} -gt 0 ]; then ( cd "$primary" && "$launcher" --add-dir "${adddirs[@]}" )
            else ( cd "$primary" && "$launcher" ); fi
            ;;
        ""|status)
            top=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "wtg: not in a git worktree" >&2; return 1; }
            grp=$(awk -F'\t' -v p="$top" '$3==p{print $1; exit}' "$WTG_FILE" 2>/dev/null)
            [ -z "$grp" ] && { echo "wtg: $(basename "$top") is not in a group"; return 0; }
            slot=$(_wtg_group_slot "$grp")
            echo "group: $grp${slot:+  (slot $slot)}"
            while IFS=$'\t' read -r g role path s; do
                [ "$g" = "$grp" ] || continue
                port=""; [ -n "$s" ] && port=":$(_wtg_port "$role" "$s")"
                printf "  %-6s %-6s %s%s\n" "$role" "$port" "$path" "$([ "$path" = "$top" ] && echo '   <- current')"
            done < "$WTG_FILE"
            ;;
        ls)
            [ -f "$WTG_FILE" ] || { echo "wtg: no groups yet"; return 0; }
            awk -F'\t' '{g[$1]=g[$1]" "$2; if($4!="")s[$1]=$4}
                END{for(k in g) printf "%-22s slot=%-3s %s\n",k,(k in s?s[k]:"-"),g[k]}' "$WTG_FILE" | sort
            ;;
        rm)
            top=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "wtg: not in a git worktree" >&2; return 1; }
            grp=$(awk -F'\t' -v p="$top" '$3==p{print $1; exit}' "$WTG_FILE" 2>/dev/null)
            _wtg_dedup "$top"
            [ -f "$top/dev.sh" ] && grep -q '^# wtg:' "$top/dev.sh" 2>/dev/null && { rm -f "$top/dev.sh"; echo "wtg: removed generated dev.sh"; }
            echo "wtg: unbound $(basename "$top")${grp:+ from '$grp'} (worktree kept)"
            repo=$(dirname "$(readlink -f "$(git rev-parse --git-common-dir)")")
            echo "  full teardown (deletes the checkout):  git -C $repo worktree remove $top"
            ;;
        *)
            top=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "wtg: not in a git worktree" >&2; return 1; }
            grp=$1
            repo=$(basename "$(dirname "$(readlink -f "$(git rev-parse --git-common-dir)")")")
            role=${2:-$(_wtg_role "$repo")}
            slot=$(_wtg_group_slot "$grp")
            _wtg_bind "$grp" "$role" "$top" "$slot"
            if [ -n "$slot" ]; then
                port=$(_wtg_port "$role" "$slot"); _wtg_write_devsh "$role" "$top" "$port" "$grp" "$slot"
                echo "wtg: $(basename "$top") -> group '$grp' as '$role' (slot $slot, :$port, dev.sh)"
            else echo "wtg: $(basename "$top") -> group '$grp' as '$role'"; fi
            ;;
    esac
}
