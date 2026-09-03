# Change Hygiene

How a change enters the repository: commits, branches, reviews, and the debt it leaves behind.

## Commits are atomic and explain why

One commit, one logical change. The diff shows what happened; the message explains why it had to.

```
feat(auth): rotate refresh tokens on use

Prevents replay after token theft: a stolen refresh token is
single-use, and reuse invalidates the family.
Implements RFC 6749 section 6.
```

`fix bug`, `update`, and `wip` are not messages. The audience is whoever runs `git blame` on this line
in two years, and the question they will have is why, not what.

Atomic commits are also what make `git bisect` and a clean revert possible. A commit that mixes a
rename, a bug fix, and a dependency bump cannot be reverted without collateral.

## Branches stay short-lived

Days, not weeks. A long-lived branch accumulates divergence at a rate that grows with its lifetime, and
the merge cost lands on whoever is least prepared for it. When work must be visible before it is
complete, merge it behind a feature flag rather than hold it on a branch.

## Never commit a secret

Environment variables, a secret manager, or an encrypted store. Scanning in CI is the backstop, not the
control. A secret that reached the remote is compromised even after the force push: rotate it, do not
just delete it.

## Pull requests stay small

200 to 400 lines is the band where review quality holds. Past that, review time per line falls and
approval starts tracking fatigue rather than correctness. A large mechanical change (a rename, a
codemod, a generated file) is the exception, and it should say so in the title so the reviewer knows
what kind of attention it needs.

If a change cannot be made small, split it by layer or by step: the migration, then the code that uses
it, then the cleanup.

## Automate everything a machine can check, before a human looks

Formatting, lint, type check, tests, dependency audit: all in CI, all before review. Human review time
is scarce and is worth spending on whether the change is correct, whether it belongs, and what it will
cost later. Style comments on a PR are a sign the tooling is missing, not that the reviewer is
thorough.

## Review the story, not just the syntax

The reviewer's first question is whether the change does what the ticket asked and whether that was the
right thing to ask for. Code that compiles, passes tests, and solves the wrong problem passes every
automated gate.

## Review the code, not the coder, and say why

| Instead of | Write |
|---|---|
| "This is wrong" | "This breaks when `items` is empty - line 42 indexes without a length check" |
| "Use a map here" | "A map here turns the nested loop into one pass; it matters because this runs per request" |
| "Why did you do it this way?" | "What made a queue the right fit here? I would have reached for a cron and want to understand the trade-off" |

Every request carries its reason: correctness, performance, readability, or consistency. A request
without a reason is a preference, and preferences belong in the linter or nowhere. Review is a
conversation with two informed parties, not a gate one of them operates.

## Track debt where it will be found

```
// TODO(#1423): remove the dual-write once the backfill completes
```

A bare `TODO` is a note to nobody. With a ticket id it is a tracked item with an owner and a condition
for removal. The same applies to a deliberate shortcut: mark it with its ceiling and its upgrade path
so a later reader can tell intent from ignorance.

## Boy Scout rule, bounded

Leave the file better: a clearer name, an extracted function, a deleted dead branch. Bounded by the
review: unrelated cleanup inside a feature PR inflates the diff and hides the change under noise. Large
cleanup gets its own commit, or its own PR.
