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
    [web]='VITE_API_URL=http://localhost:%API_PORT% npm run dev -- --port %PORT%' )
declare -A WTG_WORKDIR=(                   # role -> run subdir inside the worktree (optional)
    [web]='apps/web' )
declare -A WTG_ENV=(                       # role -> env files to seed (space-sep); default ".env"
    [web]="apps/web/.env" )
declare -A WTG_DEPS=(                      # role -> dep dir a fresh worktree lacks
    [web]='node_modules' )
declare -A WTG_SETUP=(                     # role -> how to build it, run at the worktree root
    [web]='npm install' )

WTG_PRIMARY_ROLE="api"   # the tree `wtg go` opens in (siblings are --add-dir'd)
WTG_API_ROLE="api"       # backend role %API_PORT% resolves to (what a frontend calls)
WTG_OAUTH_ROLES="api"    # roles that get the OAuth port-swap prelude in dev.sh
WTG_OAUTH_PORT=8080      # port your OAuth redirect_uris are registered against
WTG_OAUTH_VARS="PUBLIC_BASE_URL OAUTH_REDIRECT_URL"   # host:port URLs to port-swap
WTG_WORKROOT="$HOME/work"        # where worktrees are created
WTG_BASE_BRANCH="main"           # start-point for new worktrees; per-run: --base <ref>
WTG_LAUNCHER_ARGS=""             # extra argv for `wtg go` (word-split)
```

Run-command placeholders, substituted when `dev.sh` is generated:

| placeholder | becomes |
|---|---|
| `%PORT%` | this member's port for the group's slot |
| `%API_PORT%` | `WTG_API_ROLE`'s port (e.g. wire a frontend to its backend) |
| `%OAUTH_PORT%` | the OAuth-registered port |

`WTG_PRIMARY_ROLE`, `WTG_API_ROLE` and `WTG_OAUTH_ROLES` are often the same role.
Split them when they differ - e.g. the agent opens in a worker service while the
UI calls a separate api, and only the api carries the OAuth redirect.

`WTG_BASE_BRANCH` takes a bare name: repos are fetched first and the name
resolves to `origin/<name>`, so a new worktree is always cut from the latest
remote tip rather than a stale local branch. `origin/x`, a tag or a sha are used
as given, and `--base <ref>` overrides per run.

> Seeded config is written with `install -m 600`, not `cp` - these files carry
> live secrets, and `cp` would take the caller's umask and leave them 0644.

## 4. Registry

Nothing to create - the registry file (`WTG_FILE`, default
`~/.config/wtg/worktree-groups.tsv`) is written on first bind. It is the single
source of truth; safe to hand-edit. Back it up if you like; it is small.

## 5. Quickstart

Using the example roles `api` / `web` from the config above (substitute yours):

```bash
wtg new checkout api web      # worktree + feat/checkout branch per repo, bound, dev.sh,
                              #   .env seeded and deps installed - a RUNNABLE tree
wtg up checkout               # run the whole stack (tmux windows, or background)
wtg st checkout               # full table + a warnings block with the fix for each
wtg go checkout               # open one agent session across the worktrees
wtg down checkout             # stop the stack
```

`new` and `add` seed config and build deps for you, so there is no separate
setup step; `--no-env` / `--no-deps` opt out, and `wtg env` / `wtg deps` re-run
either on demand (`--force` to overwrite / rebuild).

Second concurrent feature gets the next port slot automatically:

```bash
wtg new billing api web       # slot 1 -> api :8090, web :3010
wtg claim-oauth billing       # when you need billing's OAuth: move it onto the registered port
```

Cut from somewhere other than the default base:

```bash
wtg new hotfix --base release/2.1 api      # bare name resolves to origin/release/2.1
wtg add hotfix web                         # grow an existing group, reusing its slot
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
| `wtg new <group> [--base <ref>] [--no-env] [--no-deps] <role...>` | create a group: worktree + branch + bind + dev.sh + env + deps per role |
| `wtg add <group> [--base <ref>] <role...>` | add member(s) to an existing group (reuses its slot) |
| `wtg <group> [role]` | bind the current worktree into an **existing** group |
| `wtg bind <group> [role]` | same, but may create a new group (explicit, so typos cannot) |
| `wtg env <group> [--force]` | (re)seed base config into the group's worktrees |
| `wtg deps <group> [--force]` | (re)build each member's dep dir |
| `wtg up <group>` / `wtg down <group>` | run / stop the whole stack |
| `wtg st [group] [--fetch]` | full table: branch, clean/DIRTY, upstream, behind base, port, env, deps + warnings |
| `wtg go [group]` | launch one agent session across the set (menu if no group) |
| `wtg claim-oauth <group>` | move a group onto the OAuth-registered port |
| `wtg rm` | unbind the current worktree (keeps the checkout) |
| `wtg` / `wtg ls` / `wtg help` | current group status / list all groups / command reference |

A bare `wtg <name>` only binds into a group that already **exists**. That guard
matters: without it a typo like `wtg downfoo` silently creates a group `downfoo`,
rebinds the current tree away from its real group, and overwrites its `dev.sh`.
Use `wtg bind` to create one deliberately.

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
