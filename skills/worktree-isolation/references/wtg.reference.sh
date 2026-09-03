#!/usr/bin/env bash
# wtg.reference.sh - bind parallel worktrees of one feature across separate repos,
# with per-group port slots + OAuth-safe run scripts. Reference implementation for
# the "Multi-Repo Feature Groups" pattern (see multi-repo-feature-groups.md).
#
# Stack-agnostic: roles are arbitrary and every stack-specific behaviour lives in
# the CONFIG block as data. The engine below knows nothing about any particular
# language, framework, or service, and hardcodes no role, port, or path.
# Registry: $WTG_FILE  (group<TAB>role<TAB>worktree-toplevel<TAB>slot).  slot 0 = canonical ports.
# Commands: new / add / bind / <group> [role] / env / deps / up / down / st / rm / claim-oauth / go / ls / help
#
# INSTALL: copy this file, edit the CONFIG block, then in your shell rc:
#   source /path/to/wtg.reference.sh      (requires bash 4+ for associative arrays)
# See SETUP.md for full setup (statusline, settings.json, quickstart).

# ============================================================================
# CONFIG - EDIT FOR YOUR STACK. Roles are yours to name; nothing below assumes any.
# ============================================================================
WTG_FILE="${WTG_FILE:-$HOME/.config/wtg/worktree-groups.tsv}"   # registry (group<TAB>role<TAB>toplevel<TAB>slot)
WTG_WORKROOT="${WTG_WORKROOT:-$HOME/work}"                       # where worktrees are created
WTG_BASE_BRANCH="${WTG_BASE_BRANCH:-main}"   # start-point for new worktrees; per-run override: --base <ref>

# The roles a feature can span. One role = one repo. Order is cosmetic.
WTG_ROLES=(api web)

declare -A WTG_REPO=(                  # role -> that repo's main-checkout path
    [api]="$HOME/work/api"
    [web]="$HOME/work/web" )
declare -A WTG_PORT=(                  # role -> base port. Final = base + 10*slot, so groups never collide
    [api]=8080
    [web]=3000 )
declare -A WTG_RUN=(                   # role -> launch command written into dev.sh (run via `env`, so a VAR=val prefix is fine)
    [api]='SERVER_PORT=%PORT% go run ./cmd/server'
    [web]='VITE_API_URL=http://localhost:%API_PORT% npm run dev -- --port %PORT%' )
declare -A WTG_WORKDIR=(               # role -> run subdir relative to the worktree (optional)
    [web]='apps/web' )
declare -A WTG_ENV=(                   # role -> space-separated relative env files to seed. Default ".env"
    [web]='apps/web/.env' )
declare -A WTG_DEPS=(                  # role -> dep dir a fresh worktree lacks (git checks out tracked files only)
    [web]='node_modules' )
declare -A WTG_SETUP=(                 # role -> how to build that dep dir; run at the worktree root on new/add
    [web]='npm install' )

WTG_PRIMARY_ROLE="api"                 # role `wtg go` opens in (siblings are --add-dir'd)
WTG_API_ROLE="api"                     # backend role %API_PORT% resolves to (what a frontend calls)
WTG_OAUTH_ROLES="api"                  # roles that get the OAuth port-swap prelude in dev.sh
WTG_OAUTH_PORT=8080                    # the port your OAuth redirect_uris are registered against
WTG_OAUTH_VARS="PUBLIC_BASE_URL OAUTH_REDIRECT_URL"   # host:port env vars to port-swap for OAuth roles
WTG_LAUNCHER="${WTG_LAUNCHER:-claude}" # binary `wtg go` execs
WTG_LAUNCHER_ARGS="${WTG_LAUNCHER_ARGS:-}"  # extra launcher argv, word-split (e.g. --dangerously-skip-permissions)
# PRIMARY / API / OAUTH are often the same role; split them when they differ - e.g.
# the agent opens in a worker service but the UI calls a separate api, and only the
# api carries the OAuth redirect. A bare name in WTG_BASE_BRANCH resolves to
# origin/<name> after fetch, so a new worktree is cut from the latest remote tip.
# ============================================================================
# END CONFIG. Generic, stack-agnostic implementation below - no need to edit.
# ============================================================================

_wtg_repo() { echo "${WTG_REPO[$1]}"; }
_wtg_port() { local base=${WTG_PORT[$1]:-9000}; echo $(( base + ${2:-0} * 10 )); }
_wtg_api_port() { _wtg_port "$WTG_API_ROLE" "$1"; }
_wtg_is_oauth_role() { case " ${WTG_OAUTH_ROLES:-$WTG_API_ROLE} " in *" $1 "*) return 0;; esac; return 1; }

# base ref -> a start-point that exists in this repo. A bare name prefers origin/<name>,
# so a worktree cut straight after `fetch origin` is always on the latest remote tip.
_wtg_base_ref() {  # repo base
    local repo=$1 base=$2 c
    for c in $(case "$base" in origin/*|refs/*) echo "$base";; *) echo "origin/$base $base";; esac); do
        git -C "$repo" rev-parse --verify --quiet "$c^{commit}" >/dev/null 2>&1 && { echo "$c"; return 0; }
    done
    return 1
}

_wtg_role() {  # reponame -> role (first WTG_REPO whose basename matches)
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

# generic dev.sh: substitutes the role's run command; OAuth-roles get the port-swap prelude.
_wtg_write_devsh() {  # role path port grp slot
    local role=$1 path=$2 port=$3 grp=$4 slot=$5 f="$2/dev.sh" run aport wd
    aport=$(_wtg_api_port "$slot")
    run=${WTG_RUN[$role]:-"echo 'wtg: no run command for role $role (port $port)'"}
    run=${run//%PORT%/$port}; run=${run//%API_PORT%/$aport}; run=${run//%OAUTH_PORT%/$WTG_OAUTH_PORT}
    wd=${WTG_WORKDIR[$role]}
    {
        echo '#!/usr/bin/env bash'
        echo "# wtg: role '$role' for group '$grp' (slot $slot) on :$port."
        if _wtg_is_oauth_role "$role" && [ "$slot" -ne 0 ]; then
            echo "#"
            echo "# WARNING slot $slot: :$port is NOT the OAuth-registered port ($WTG_OAUTH_PORT)."
            echo "# Provider redirect_uri mismatch; OAuth 'connect' flows fail here. Use: wtg claim-oauth $grp"
        fi
        echo 'cd "$(dirname "$0")" || exit 1'
        if _wtg_is_oauth_role "$role" && [ -n "$WTG_OAUTH_VARS" ]; then
            echo "_g(){ grep -E \"^\$1=\" .env 2>/dev/null | head -1 | cut -d= -f2-; }"
            echo "for v in $WTG_OAUTH_VARS; do cur=\"\$(_g \"\$v\")\"; [ -n \"\$cur\" ] && export \"\$v=\${cur/:$WTG_OAUTH_PORT/:$port}\"; done"
        fi
        [ -n "$wd" ] && echo "cd $wd || exit 1"
        echo "exec env $run"
    } > "$f"
    chmod +x "$f"
}

_wtg_dedup() {
    [ -f "$WTG_FILE" ] || return 0
    awk -F'\t' -v p="$1" '$3!=p' "$WTG_FILE" > "$WTG_FILE.tmp" && mv "$WTG_FILE.tmp" "$WTG_FILE"
}

_wtg_bind_here() {  # group [role] — bind the current worktree into <group>
    local grp=$1 top repo role slot port r
    top=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "wtg: not in a git worktree" >&2; return 1; }
    repo=$(basename "$(dirname "$(readlink -f "$(git rev-parse --git-common-dir)")")")
    role=${2:-$(_wtg_role "$repo")}
    for r in "${WTG_ROLES[@]}"; do
        [ "${WTG_REPO[$r]}" = "$top" ] && { echo "  ! note: $(basename "$top") is the MAIN checkout, not a feature worktree — 'wtg up $grp' will run dev.sh here"; break; }
    done
    slot=$(_wtg_group_slot "$grp")
    _wtg_bind "$grp" "$role" "$top" "$slot"
    if [ -n "$slot" ]; then
        port=$(_wtg_port "$role" "$slot"); _wtg_write_devsh "$role" "$top" "$port" "$grp" "$slot"
        echo "wtg: $(basename "$top") -> group '$grp' as '$role' (slot $slot, :$port, dev.sh)"
    else echo "wtg: $(basename "$top") -> group '$grp' as '$role'"; fi
}
_wtg_bind() { mkdir -p "$(dirname "$WTG_FILE")"; touch "$WTG_FILE"; _wtg_dedup "$3"; printf '%s\t%s\t%s\t%s\n' "$1" "$2" "$3" "$4" >> "$WTG_FILE"; }
_wtg_group_exists() { awk -F'\t' -v g="$1" '$1==g{f=1} END{exit !f}' "$WTG_FILE" 2>/dev/null; }

_wtg_add_member() {  # group role slot branch base
    local grp=$1 role=$2 slot=$3 branch=$4 base=$5 repo path port start from
    repo=$(_wtg_repo "$role")
    { [ -z "$repo" ] || [ ! -d "$repo" ]; } && { echo "  ! $role: no repo ($repo) — check WTG_REPO — skipped"; return 1; }
    path="$WTG_WORKROOT/$grp-$role"
    [ -e "$path" ] && { echo "  ! $role: $path exists — skipped"; return 1; }
    git -C "$repo" fetch origin --quiet || echo "  ! $role: fetch failed — '$base' may be stale"
    start=$(_wtg_base_ref "$repo" "$base") \
        || { echo "  ! $role: base '$base' not found in $(basename "$repo") — skipped"; return 1; }
    if git -C "$repo" worktree add "$path" -b "$branch" "$start" >/dev/null 2>&1; then from="from $start"
    elif git -C "$repo" worktree add "$path" "$branch" >/dev/null 2>&1; then from="existing branch $branch, base ignored"
    else echo "  ! $role: git worktree add failed — skipped"; return 1; fi
    _wtg_bind "$grp" "$role" "$path" "$slot"
    if [ -n "$slot" ]; then
        port=$(_wtg_port "$role" "$slot"); _wtg_write_devsh "$role" "$path" "$port" "$grp" "$slot"
        echo "  + $role  :$port  $path  ($from, dev.sh)"
    else echo "  + $role  $path  ($from, bound, no slot)"; fi
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
    # install -m 600, not cp: these carry live secrets (.env, service-account
    # JSON, tfvars) and cp would take the caller's umask, leaving them 0644.
    mkdir -p "$(dirname "$dst")" && install -m 600 "$src" "$dst" && echo "  + seeded $dst"
}

_wtg_tilde() { echo "${1/#$HOME/\~}"; }

# Build a member's dep dir (node_modules / .venv / ...). git worktree gives you a
# checkout, not a runnable tree — without this, dev.sh starts and dies.
_wtg_deps_member() {  # group role path [force]
    local grp=$1 role=$2 path=$3 force=$4 dep=${WTG_DEPS[$role]} cmd=${WTG_SETUP[$role]} log
    [ -z "$cmd" ] && { echo "  = $role: no deps needed"; return 0; }
    [ -d "$path" ] || { echo "  ! $role: worktree missing ($path)"; return 1; }
    if [ -e "$path/$dep" ] && [ -z "$force" ]; then echo "  = $role: $dep/ already there (--force to rebuild)"; return 0; fi
    log="$(_wtg_run_dir "$grp")/setup-$role.log"; mkdir -p "$(dirname "$log")"
    echo "  · $role: $cmd"
    if ( cd "$path" && eval "$cmd" ) > "$log" 2>&1; then
        echo "  + $role: $dep/ ready"
    else
        echo "  ! $role: setup FAILED — last lines of $(_wtg_tilde "$log"):"
        tail -5 "$log" | sed 's/^/      /'
        return 1
    fi
}

_wtg_env_state() {  # role path -> ok | MISS | have/want
    local role=$1 path=$2 rel have=0 want=0
    for rel in ${WTG_ENV[$role]:-.env}; do
        want=$((want + 1)); [ -f "$path/$rel" ] && have=$((have + 1))
    done
    if [ "$have" -eq "$want" ]; then echo ok
    elif [ "$have" -eq 0 ]; then echo MISS
    else echo "$have/$want"; fi
}
_wtg_dep_state() {  # role path -> ok | MISS | -   (- = role needs no dep dir)
    local dep=${WTG_DEPS[$1]}
    [ -z "$dep" ] && { echo '-'; return; }
    [ -e "$2/$dep" ] && echo ok || echo MISS
}

# The one renderer behind `st`, `status`, `go` and `new`/`add`: everything you need
# to know before you start working in a group, in one pass.
_wtg_table() {  # group [--fetch]
    local grp=$1 fetch=$2 slot top g role path s br dirty sync behind port envs deps mark base_ref n=0
    local -a w_env w_dep w_dirty w_gone w_behind
    slot=$(_wtg_group_slot "$grp")
    top=$(git rev-parse --show-toplevel 2>/dev/null)

    printf '\n┌─ %s   slot %s\n│\n' "$grp" "${slot:--}"
    printf '│  %-1s %-4s  %-26s  %-6s  %-9s  %-13s  %-6s  %-5s  %-5s  %s\n' \
           '' role branch state upstream "behind $WTG_BASE_BRANCH" port env deps path
    printf '│  %-1s %-4s  %-26s  %-6s  %-9s  %-13s  %-6s  %-5s  %-5s  %s\n' \
           '' ──── ────────────────────────── ────── ───────── ───────────── ────── ───── ───── ──────────────────────
    while IFS=$'\t' read -r g role path s; do
        [ "$g" = "$grp" ] || continue
        n=$((n + 1)); mark=' '; [ "$path" = "$top" ] && mark='›'
        if [ ! -d "$path" ]; then
            w_gone+=("$role")
            printf '│  %-1s %-4s  %-26s  %-6s  %-9s  %-13s  %-6s  %-5s  %-5s  %s\n' \
                   "$mark" "$role" '(worktree missing)' - - - - - - "$(_wtg_tilde "$path")"
            continue
        fi
        [ -n "$fetch" ] && git -C "$path" fetch origin --quiet 2>/dev/null

        br=$(git -C "$path" symbolic-ref --short HEAD 2>/dev/null || git -C "$path" rev-parse --short HEAD 2>/dev/null || echo '?')
        if git -C "$path" diff --quiet 2>/dev/null && git -C "$path" diff --cached --quiet 2>/dev/null
        then dirty=clean; else dirty=DIRTY; w_dirty+=("$role"); fi

        sync=$(git -C "$path" rev-list --left-right --count 'HEAD...@{upstream}' 2>/dev/null)
        if [ -n "$sync" ]; then sync="+${sync%%[[:space:]]*}/-${sync##*[[:space:]]}"; else sync='unpushed'; fi

        behind='-'
        base_ref=$(_wtg_base_ref "$path" "$WTG_BASE_BRANCH") \
            && behind=$(git -C "$path" rev-list --count "HEAD..$base_ref" 2>/dev/null || echo '?')
        [ "$behind" != '-' ] && [ "$behind" != '0' ] && [ "$behind" != '?' ] && w_behind+=("$role:$behind")

        port='-'; [ -n "$s" ] && port=":$(_wtg_port "$role" "$s")"
        envs=$(_wtg_env_state "$role" "$path");  [ "$envs" = ok ] || w_env+=("$role")
        deps=$(_wtg_dep_state "$role" "$path");  [ "$deps" = MISS ] && w_dep+=("$role")

        printf '│  %-1s %-4s  %-26.26s  %-6s  %-9s  %-13s  %-6s  %-5s  %-5s  %s\n' \
               "$mark" "$role" "$br" "$dirty" "$sync" "$behind" "$port" "$envs" "$deps" "$(_wtg_tilde "$path")"
    done < "$WTG_FILE"
    [ "$n" -eq 0 ] && { printf '│  (no members)\n└─\n'; return 0; }
    printf '│\n'

    local issues=0
    if [ ${#w_gone[@]} -gt 0 ]; then
        printf '├─ ! worktree missing: %s — re-create with: wtg add %s %s\n' "${w_gone[*]}" "$grp" "${w_gone[*]}"; issues=1
    fi
    if [ -n "$slot" ] && [ "$slot" -ne 0 ]; then
        printf '├─ ! OAuth: slot %s puts %s on :%s, not the registered :%s — connect flows fail.\n│     claim it with: wtg claim-oauth %s\n' \
               "$slot" "$WTG_API_ROLE" "$(_wtg_api_port "$slot")" "$WTG_OAUTH_PORT" "$grp"; issues=1
    fi
    if [ ${#w_env[@]} -gt 0 ]; then
        printf '├─ ! .env not seeded: %s — worktrees do not inherit gitignored files.\n│     seed with: wtg env %s\n' "${w_env[*]}" "$grp"; issues=1
    fi
    if [ ${#w_dep[@]} -gt 0 ]; then
        for role in "${w_dep[@]}"; do
            path=$(awk -F'\t' -v g="$grp" -v r="$role" '$1==g && $2==r{print $3; exit}' "$WTG_FILE")
            printf '├─ ! %s: %s/ missing — dev.sh will not start.\n│     build it with: cd %s && %s\n' \
                   "$role" "${WTG_DEPS[$role]}" "$(_wtg_tilde "$path")" "${WTG_SETUP[$role]:-<install deps>}"
        done; issues=1
    fi
    [ ${#w_dirty[@]}  -gt 0 ] && { printf '├─ · uncommitted changes: %s\n' "${w_dirty[*]}"; issues=1; }
    [ ${#w_behind[@]} -gt 0 ] && { printf '├─ · behind %s: %s — rebase before you build on it\n' "$WTG_BASE_BRANCH" "${w_behind[*]}"; issues=1; }
    [ "$issues" -eq 0 ] && printf '├─ ready: env seeded, deps built, clean, up to date\n'
    [ -z "$fetch" ] && printf '│  (counts are vs the last fetch — wtg st %s --fetch to refresh)\n' "$grp"
    printf '└─\n\n'
}

wtg() {
    local top repo role grp slot port path branch other src_repo force rel base
    local -a _roles

    case "$1" in
        new|add)
            local cmd=$1; grp=$2; shift 2 2>/dev/null
            base="$WTG_BASE_BRANCH"; _roles=()
            local do_env=1 do_deps=1
            while [ $# -gt 0 ]; do
                case "$1" in
                    --base|-B) base=$2; shift; [ $# -gt 0 ] && shift ;;
                    --base=*)  base=${1#*=}; shift ;;
                    --no-env)  do_env=""; shift ;;
                    --no-deps) do_deps=""; shift ;;
                    *)         _roles+=("$1"); shift ;;
                esac
            done
            { [ -z "$grp" ] || [ ${#_roles[@]} -eq 0 ] || [ -z "$base" ]; } && {
                echo "usage: wtg $cmd <group> [--base <ref>] <role...>"
                echo "  roles: ${WTG_ROLES[*]}    base default: $WTG_BASE_BRANCH (bare name resolves to origin/<name> after fetch)"
                return 1; }
            if [ "$cmd" = new ]; then
                _wtg_group_exists "$grp" && { echo "wtg: group '$grp' already exists — use 'wtg add $grp <role...>'"; return 1; }
                slot=$(_wtg_next_slot)
            else
                _wtg_group_exists "$grp" || { echo "wtg add: no group '$grp' — use 'wtg new $grp <role...>'"; return 1; }
                slot=$(_wtg_group_slot "$grp")
            fi
            branch="feat/$grp"
            echo "wtg $cmd: group '$grp'${slot:+ -> slot $slot}, branch $branch, base $base"
            local added=0
            for role in "${_roles[@]}"; do
                _wtg_add_member "$grp" "$role" "$slot" "$branch" "$base" && added=$((added + 1))
            done
            if [ "$added" -eq 0 ]; then
                echo "wtg $cmd: no members added"
                [ "$cmd" = new ] && echo "  group '$grp' was not created"
                return 1
            fi
            if [ -n "$do_env" ]; then
                echo "seeding .env (worktrees do not inherit gitignored files):"
                for role in "${_roles[@]}"; do
                    path="$WTG_WORKROOT/$grp-$role"; src_repo=$(_wtg_repo "$role")
                    [ -d "$path" ] || continue
                    for rel in ${WTG_ENV[$role]:-.env}; do _wtg_copy_env "$src_repo/$rel" "$path/$rel" ""; done
                done
            fi
            if [ -n "$do_deps" ]; then
                echo "installing deps (one-off per worktree; a fresh node_modules/venv takes a minute):"
                for role in "${_roles[@]}"; do
                    path="$WTG_WORKROOT/$grp-$role"
                    [ -d "$path" ] && _wtg_deps_member "$grp" "$role" "$path" ""
                done
            fi
            _wtg_table "$grp"
            echo "next: wtg up $grp   →   wtg go $grp"
            ;;
        deps)
            grp=$2; force=""; [ "$3" = "--force" ] && force=1
            [ -z "$grp" ] && { echo "usage: wtg deps <group> [--force]"; return 1; }
            _wtg_group_exists "$grp" || { echo "wtg deps: no group '$grp'"; return 1; }
            echo "wtg deps: building dep dirs for '$grp'${force:+ (force rebuild)}"
            while IFS=$'\t' read -r g role path _; do
                [ "$g" = "$grp" ] || continue
                _wtg_deps_member "$grp" "$role" "$path" "$force"
            done < "$WTG_FILE"
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
            local -a _mrole _mpath; local i session rd key pid sid; local -A _seen=()
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
                sid=""; command -v setsid >/dev/null 2>&1 && sid=setsid   # own process group, so `down` can kill the whole tree
                for i in "${!_mpath[@]}"; do
                    key=${_mrole[$i]}; _seen[$key]=$(( ${_seen[$key]:-0} + 1 ))
                    [ "${_seen[$key]}" -gt 1 ] && key="$key${_seen[$key]}"
                    pid=$(cat "$rd/$key.pid" 2>/dev/null)
                    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
                        echo "  = $key already running (pid $pid) — wtg down $grp first"; continue
                    fi
                    # `;` not `&&`: with `cd && cmd &` the whole list backgrounds and $! is a
                    # wrapper bash, not dev.sh — killing it leaves the real server tree alive
                    ( cd "${_mpath[$i]}" || exit 1; $sid nohup ./dev.sh > "$rd/$key.log" 2>&1 & echo $! > "$rd/$key.pid" )
                    echo "  + $key pid $(cat "$rd/$key.pid" 2>/dev/null)  log $rd/$key.log"
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
                    pid=$(cat "$pf")
                    if kill -- "-$pid" 2>/dev/null; then echo "  killed $(basename "$pf" .pid) (pgid $pid)"
                    elif kill "$pid" 2>/dev/null; then echo "  killed $(basename "$pf" .pid) (pid $pid — no process group, children may survive)"
                    else echo "  · $(basename "$pf" .pid) (pid $pid) was not running"; fi
                    rm -f "$pf"; stopped=1
                done
            fi
            [ "$stopped" = 0 ] && echo "wtg down: nothing running for '$grp'"
            ;;
        st)
            grp=$2; force=""
            [ "$2" = "--fetch" ] && { grp=""; force=1; }
            [ "$3" = "--fetch" ] && force=1
            if [ -z "$grp" ]; then
                top=$(git rev-parse --show-toplevel 2>/dev/null)
                grp=$(awk -F'\t' -v p="$top" '$3==p{print $1; exit}' "$WTG_FILE" 2>/dev/null)
                [ -z "$grp" ] && { echo "usage: wtg st <group> [--fetch]"; return 1; }
            fi
            _wtg_group_exists "$grp" || { echo "wtg st: no group '$grp'"; return 1; }
            [ -n "$force" ] && echo "fetching origin for each member..."
            _wtg_table "$grp" "$force"
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
            local -a _groups adddirs largs; local primary launcher="$WTG_LAUNCHER"
            read -ra largs <<<"$WTG_LAUNCHER_ARGS"
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
            _wtg_table "$grp"
            echo "wtg go: $(_wtg_tilde "$primary")${adddirs:+   +add-dir: $(_wtg_tilde "${adddirs[*]}")}${largs:+   [${largs[*]}]}"
            if [ ${#adddirs[@]} -gt 0 ]; then ( cd "$primary" && "$launcher" "${largs[@]}" --add-dir "${adddirs[@]}" )
            else ( cd "$primary" && "$launcher" "${largs[@]}" ); fi
            ;;
        ""|status)
            top=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "wtg: not in a git worktree" >&2; return 1; }
            grp=$(awk -F'\t' -v p="$top" '$3==p{print $1; exit}' "$WTG_FILE" 2>/dev/null)
            [ -z "$grp" ] && { echo "wtg: $(basename "$top") is not in a group"; return 0; }
            _wtg_table "$grp"
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
        help|-h|--help)
            cat <<EOF
wtg — parallel worktrees of one feature across repos.  roles: ${WTG_ROLES[*]}
registry: $WTG_FILE

bind / inspect
  wtg <group> [role]         bind the current worktree into an EXISTING <group> (role auto-derived from its repo)
  wtg bind <group> [role]    same, but may create a new group (explicit, so typos can't create groups)
  wtg [status]               show the current worktree's group + members
  wtg ls                     list all groups (name, slot, roles)
  wtg st <group> [--fetch]   full table: branch, clean/DIRTY, upstream, behind $WTG_BASE_BRANCH, port, .env, deps
                             (--fetch refreshes the remote first; also shown by 'go', 'new' and 'add')
  wtg rm                     unbind the current worktree from its group (checkout kept)

create / grow      new/add leave a RUNNABLE tree: worktree + .env seeded + deps installed
  wtg new <group> [--base <ref>] [--no-env] [--no-deps] <role...>   new group, one worktree per role
  wtg add <group> [--base <ref>] [--no-env] [--no-deps] <role...>   add roles to an existing group
  wtg env  <group> [--force]                 (re)seed base .env files into the worktrees
  wtg deps <group> [--force]                 (re)build dep dirs: $(for r in "${WTG_ROLES[@]}"; do [ -n "${WTG_SETUP[$r]}" ] && printf '%s=%s ' "$r" "${WTG_DEPS[$r]}"; done)

  base: default '$WTG_BASE_BRANCH'. Repos are fetched first and a bare name resolves to origin/<name>,
  so you always cut from the latest remote tip, never a stale local branch. origin/x, a tag or a
  sha are taken as given. Override the default with \$WTG_BASE_BRANCH.

run
  wtg up <group>             start each member's dev.sh (tmux windows, else nohup background)
  wtg down <group>           stop a group's running dev servers
  wtg claim-oauth <group>    move <group> onto the OAuth-registered port (:$WTG_OAUTH_PORT, slot 0)
  wtg go [group]             open <group> in '$WTG_LAUNCHER${WTG_LAUNCHER_ARGS:+ $WTG_LAUNCHER_ARGS}' from the '$WTG_PRIMARY_ROLE' role (+add-dir the rest)

  wtg help                   this message
EOF
            ;;
        bind)
            [ -z "$2" ] && { echo "usage: wtg bind <group> [role]"; return 1; }
            _wtg_bind_here "$2" "$3"
            ;;
        *)
            # typo guard: a bare name only binds into a group that already exists,
            # so `wtg downfoo` can't silently create group 'downfoo' and rebind this tree
            _wtg_group_exists "$1" || {
                echo "wtg: no command or group '$1'" >&2
                echo "  commands: new add bind env deps up down st claim-oauth go ls rm help" >&2
                echo "  bind the current worktree into a NEW group: wtg bind $1 [role]" >&2
                return 1; }
            _wtg_bind_here "$1" "$2"
            ;;
    esac
}
