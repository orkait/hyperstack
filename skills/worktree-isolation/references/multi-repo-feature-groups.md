# Multi-Repo Feature Groups - adoption reference

A concrete, tool-agnostic recipe for the pattern described in `SKILL.md` under
"Multi-Repo Feature Groups". Read that section first for the why; this file is
the how, generic enough to drop into any stack.

## When you need it

A single feature spans several repositories - for example a backend, a
worker/AI service, and a frontend - each in its own repo with its own branch.
You want to create, run, track, and tear down that whole set as one unit. Git
worktrees isolate one repo; nothing binds worktrees across repos. This recipe
adds that binding with a small registry plus a set of verbs.

## The model

- A **group** is one feature.
- A **member** is one worktree per repo the feature touches, tagged with a
  **role** (`be`, `ai`, `ui`, ... - your choice).
- A **registry** file is the single source of truth. Membership is always
  explicit; never infer it from matching branch names, which drift per repo.

### Registry schema

One tab-separated line per member:

```
<group>	<role>	<worktree-abspath>	<slot>
```

`slot` is optional (empty for hand-bound groups). The worktree path is the
absolute toplevel (`git rev-parse --show-toplevel`), so lookups work from any
subdirectory.

## Command surface

| verb | does |
|---|---|
| `new <group> <role...>` | create a worktree + feature branch per role, bind them, assign the next free slot, generate a run script, seed config, build deps |
| `add <group> <role...>` | add member(s) to an existing group, reusing its slot |
| `bind <group> [role]` | fold the current worktree in, inheriting the group's slot |
| `env <group>` | seed gitignored config (`.env`, secrets) from each repo's main checkout into the worktrees |
| `deps <group>` | build each member's dependency dir (see "Dependencies" below) |
| `up` / `down <group>` | run / stop every member's run script as one stack |
| `st <group>` | cross-repo status: branch, dirty, ahead/behind, behind-base, port, config, deps |
| `rm` | unbind the current worktree (keep the checkout) |
| `claim-oauth <group>` | move a group onto the OAuth-registered port (see below) |
| `go [group]` | open one agent/editor session across the whole set |

Bind-by-bare-name must resolve to an **existing** group. Otherwise a mistyped
verb (`wtg downfoo`) silently creates a group, rebinds the current tree away from
its real one, and overwrites its run script. Creating a group from the current
tree should be its own explicit verb.

## Port slots (running several groups at once)

Give each group an integer `slot`. Derive every service's port from it so groups
never collide:

```
port(role, slot) = basePort[role] + 10 * slot
```

Slot 0 = your canonical ports. `nextFreeSlot = smallest N >= 0 not used by any group`.

## OAuth pinning (the sharp edge)

OAuth `redirect_uri`s are pre-registered with the provider at a fixed host:port.
A service on any other port gets a redirect mismatch and the flow fails. So the
registered port is a **singleton** - only the slot-0 group can complete OAuth.

Two mitigations, both in the generated run script:

1. Port-swap the OAuth/base URLs from the service's config to the slot's port,
   so at slot 0 it is a no-op and at slot N it stays internally consistent.
2. A `claim-oauth` verb that moves a group to slot 0 (swapping out whoever held
   it) when its OAuth flows need testing.

## Generated run scripts

Generate one run script per member so the whole stack starts with the right port
and config. Two cases:

- **Port is env-driven** (service reads `PORT`/`SERVER_PORT` from env or a
  dotenv file): set it via an environment prefix on the launch command.
- **Port is hardcoded in source** (e.g. `uvicorn.run(port=8000)`, a bundler's
  `server.port`): pass a launch flag (`--port`) instead - an env file will not
  change it. Verify which per service; do not assume an env file is enough.

Point the frontend at the group's backend by exporting its API-base variable to
the group's BE port.

## Config not carried by the worktree

`git worktree add` checks out tracked files only. Gitignored config (`.env`,
local secrets) is never created in a fresh worktree, but services read it - so a
new member boots mis-configured until you seed its config from the repo's main
checkout. Make the seed step idempotent (skip existing files unless forced).

Write seeded config with an explicit mode (`install -m 600`), not a plain copy.
These files hold live credentials, and a copy inherits the caller's umask - on a
common `0002` umask that leaves secrets world-readable at `0644`.

## Dependencies are not carried either

The same gap applies to build output: a worktree has no `node_modules`,
`.venv`, or equivalent, so a freshly created member starts and immediately dies.
Declare per role both the directory that must exist and the command that builds
it, then run it at creation time. Skip a dir that is already present unless a
force flag is passed, and log failures with the tail of the build log - a silent
dependency failure looks identical to a broken run script later.

Creation should therefore leave a **runnable** tree: worktree + branch + run
script + config + dependencies. Anything less defers a failure to first run.

## Grouped session (working the set as one)

Open one agent/editor session in the group's primary worktree and grant it
read/write access to the siblings (a multi-directory flag), rather than one
session per worktree. Run the launcher in a subshell so the caller's working
directory and environment are untouched on exit, and keep any "active group"
indicator ephemeral (a status row torn down on exit) - never mutate the shell
prompt or persist state that outlives the session.

If your host runs interactive pickers without a controlling terminal (many agent
hooks do), the group selector must be a shell launcher, not a startup hook.

## What you fill in to adopt this

Everything above is generic. To port it, supply:

- **role -> repo** map (which main checkout each role's worktree comes from).
- **role -> base port** map, and the canonical OAuth port.
- **base branch** to fork from, and where worktrees live (a workroot).
- the **config filenames** to seed per role (root `.env`, per-app `.env`, ...).
- the **OAuth env var names** whose value is `host:port`.
- the **run command** per role (env-prefix vs `--port` flag).

## Reusable snippets

Read a worktree's branch with no `git` subprocess (cheap enough for a prompt):

```bash
head_branch() {  # worktree-abspath
    local wt=$1 gd line head
    if [ -d "$wt/.git" ]; then gd="$wt/.git"
    elif [ -f "$wt/.git" ]; then IFS= read -r line < "$wt/.git"; gd=${line#gitdir: }
         case "$gd" in /*) : ;; *) gd="$wt/$gd" ;; esac
    else printf '?'; return; fi
    IFS= read -r head < "$gd/HEAD" 2>/dev/null || { printf '?'; return; }
    case "$head" in
        "ref: refs/heads/"*) printf '%s' "${head#ref: refs/heads/}" ;;
        ?*) printf '%s' "${head:0:7}" ;;
        *) printf '?' ;;
    esac
}
```

Port-swap OAuth URLs in a generated backend run script (env-prefix example):

```bash
PORT=8090; BASE=8080
g(){ grep -E "^$1=" .env 2>/dev/null | head -1 | cut -d= -f2-; }
export SERVER_PORT="$PORT"
for v in PUBLIC_BASE_URL OAUTH_REDIRECT_URL; do
    cur="$(g "$v")"; [ -n "$cur" ] && export "$v=${cur/:$BASE/:$PORT}"
done
exec <your-backend-run-command>
```
