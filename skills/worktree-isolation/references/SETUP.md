# wtg setup - full configuration steps

Everything needed to go from zero to a working multi-repo feature-group workflow
with the reference implementation `wtg.reference.sh`. Read
`multi-repo-feature-groups.md` for the concepts; this file is the install.

## 1. Prerequisites

- `bash` 4+, `git` 2.5+ (worktrees), `awk`, `grep` - standard on Linux/macOS.
- Optional: `tmux` (nicer `wtg up`; falls back to background processes).
- Optional: the agent/editor you launch with `wtg go` (default `claude`; override
  with `WTG_LAUNCHER`).
- Each repo your features span should have a clean main checkout somewhere on disk.

## 2. Install the script

```bash
mkdir -p ~/.local/lib
cp wtg.reference.sh ~/.local/lib/wtg.sh      # or clone this skill's references/ dir
```

Source it from your shell rc so `wtg` is available in every terminal:

```bash
echo 'source ~/.local/lib/wtg.sh' >> ~/.bashrc   # or ~/.zshrc
```

Open a new terminal (or `source ~/.bashrc`) and check: `wtg ls` should print
`wtg: no groups yet`.

## 3. Configure (edit the CONFIG block at the top of the script)

Roles are arbitrary strings - name them for your stack (`api`, `web`, `worker`,
`mobile`, ...). Nothing in the implementation assumes any role, language, or
framework; every stack-specific behaviour is data in this block.

```bash
WTG_ROLES=(api web)                       # the roles a feature can span (one repo each)

declare -A WTG_REPO=(                      # role -> that repo's main-checkout path
    [api]="$HOME/work/api"  [web]="$HOME/work/web" )
declare -A WTG_PORT=(                      # role -> base port (final = base + 10*slot)
    [api]=8080  [web]=3000 )
declare -A WTG_RUN=(                       # role -> launch command written into dev.sh
    [api]='SERVER_PORT=%PORT% go run ./cmd/server'
    [web]='VITE_API_URL=http://localhost:%PRIMARY_PORT% npm run dev -- --port %PORT%' )
declare -A WTG_ENV=(                       # role -> env files to seed (space-sep); default ".env"
    [web]="apps/web/.env" )

WTG_PRIMARY_ROLE="api"   # the OAuth-bearing role; the tree `wtg go` opens in
WTG_OAUTH_PORT=8080      # port your OAuth redirect_uris are registered against
WTG_OAUTH_VARS="PUBLIC_BASE_URL OAUTH_REDIRECT_URL"   # host:port URLs to port-swap for the primary
WTG_WORKROOT="$HOME/work"        # where worktrees are created
WTG_BASE_BRANCH="origin/main"    # branch new worktrees fork from
```

Run-command placeholders, substituted when `dev.sh` is generated:

| placeholder | becomes |
|---|---|
| `%PORT%` | this member's port for the group's slot |
| `%PRIMARY_PORT%` | the primary role's port (e.g. wire a frontend to its backend) |
| `%OAUTH_PORT%` | the OAuth-registered port |

Only `WTG_PRIMARY_ROLE` receives the OAuth port-swap prelude and is the tree
`wtg go` opens in; every other role simply runs its command.

## 4. Registry

Nothing to create - the registry file (`WTG_FILE`, default
`~/.config/wtg/worktree-groups.tsv`) is written on first bind. It is the single
source of truth; safe to hand-edit. Back it up if you like; it is small.

## 5. Quickstart

Using the example roles `api` / `web` from the config above (substitute yours):

```bash
wtg new checkout api web      # a worktree + feat/checkout branch per repo, bound, with dev.sh
wtg env checkout              # seed each repo's base env into the new worktrees
wtg up checkout               # run the whole stack (tmux windows, or background)
wtg st checkout               # branch / dirty / ahead-behind / port per member
wtg go checkout               # open one agent session across the worktrees
wtg down checkout             # stop the stack
```

Second concurrent feature gets the next port slot automatically:

```bash
wtg new billing api web       # slot 1 -> api :8090, web :3010
wtg claim-oauth billing       # when you need billing's OAuth: move it onto the primary port
```

## 6. Optional: Claude Code statusline integration

Show the active group + members + port in the Claude Code statusline. Add a
`statusLine` command in `~/.claude/settings.json`:

```json
{
  "statusLine": { "type": "command", "command": "bash ~/.local/lib/wtg-statusline.sh" }
}
```

A minimal `wtg-statusline.sh` that reads the registry and prints the group of the
current directory (merge into your existing statusline if you have one):

```bash
#!/usr/bin/env bash
input=$(cat); reg="${WTG_FILE:-$HOME/.config/wtg/worktree-groups.tsv}"
cwd=$(printf '%s' "$input" | sed -n 's/.*"current_dir"[: ]*"\([^"]*\)".*/\1/p')
top=$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null)
[ -n "$top" ] && [ -f "$reg" ] && grp=$(awk -F'\t' -v p="$top" '$3==p{print $1; exit}' "$reg")
[ -n "$grp" ] && printf ' \342\221\202%s' "$grp"    # ⑂<group>
printf ' %s\n' "$(basename "${cwd:-$PWD}")"
```

The statusline renders only inside the running agent TUI and is torn down on
exit; it never touches your shell prompt.

## 7. Command reference

| command | does |
|---|---|
| `wtg new <group> <role...>` | create a new group: worktree + branch + bind + dev.sh per role |
| `wtg add <group> <role...>` | add member(s) to an existing group (reuses its slot) |
| `wtg <group> [role]` | bind the current worktree into a group |
| `wtg env <group> [--force]` | seed base `.env` into the group's worktrees |
| `wtg up <group>` / `wtg down <group>` | run / stop the whole stack |
| `wtg st [group]` | cross-repo branch / dirty / ahead-behind / port |
| `wtg go [group]` | launch one agent session across the set (menu if no group) |
| `wtg claim-oauth <group>` | move a group onto the OAuth-registered port |
| `wtg rm` | unbind the current worktree (keeps the checkout) |
| `wtg` / `wtg ls` | current group status / list all groups |

## 8. Testing your config safely

Dry-run against throwaway repos by re-declaring the config arrays after sourcing
(assignments after `source` win over the file's defaults), so your real setup is
untouched:

```bash
source ~/.local/lib/wtg.sh
WTG_FILE=/tmp/reg.tsv; WTG_WORKROOT=/tmp/wt
WTG_ROLES=(api web)
declare -A WTG_REPO=([api]=/tmp/repoA [web]=/tmp/repoB)
declare -A WTG_PORT=([api]=8080 [web]=3000)
declare -A WTG_RUN=([api]='echo api %PORT%' [web]='echo web %PORT%')
WTG_PRIMARY_ROLE=api
wtg new demo api web && cat "$WTG_FILE"
```
