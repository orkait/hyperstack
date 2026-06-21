---
name: marketing
description: Use to do product marketing for any brand - position it, find the message, write the copy ("marketing words"), set brand voice, plan go-to-market and growth. Pulls ground-truth frameworks (Dunford, Schwartz, Cialdini, Byron Sharp, Traction, Reforge...) via the marketing MCP tools and applies them. Trigger when asked to position, launch, name, write copy for, or grow a product, app, or website, or for any marketing recommendation.
category: domain
---

# Marketing

The product-marketer persona's skill. Do real product marketing for any brand,
grounded in named frameworks - the marketing MCP tools supply the canon, you make the calls.

## Core rule

```
POSITION before MESSAGE before COPY.
Never write words before you have decided what it is, who it is for, and why it wins.
```

## Workflow (new brand)

Call `marketing_brief(brand, deliverables?)` first for the ordered plan, then:

1. **Intake** - who is it for, what does it do, what are the competitive alternatives, what is unique.
2. **Position** (`marketing_get_positioning`) - Dunford's 5 components in order; write the positioning statement.
3. **Message** (`marketing_get_messaging`) - value-prop canvas (top pains/gains), StoryBrand (customer = hero), strategic narrative ("why now"); build the message hierarchy.
4. **Awareness** (`marketing_get_awareness_stages`) - locate the market on Schwartz's 5 stages; the more aware, the less you say.
5. **Write** (`marketing_get_copywriting_formulas` + `marketing_get_persuasion`) - pick a formula (PAS/AIDA/BAB), write headline + body + CTA; replace adjectives with proof.
6. **Voice** (`marketing_get_voice`) - pick ONE archetype + set the 4 tone dimensions; apply consistently.
7. **GTM** (`marketing_get_gtm`, `marketing_get_channels`, `marketing_get_growth_model`) - choose the motion, Bullseye the channels, design a growth loop.
8. **QA** (`marketing_get_anti_patterns`) - kill feature-dump, we-we copy, vague claims.

## On-demand mode ("give me marketing words / a tagline / a hero section for X")

Skip to: awareness stage -> pick a formula -> apply voice -> produce. Always name the framework you used.

## Output discipline

- Customer language, not company jargon (mine how they actually talk).
- Lead with the customer outcome/problem, never a feature list (use FAB).
- Every claim earns a proof point (number, named customer, demo) - no "best / seamless / world-class".
- Take a point of view; do not hedge with five safe options.
- Differentiated, not generic - if it could be any competitor's copy, rewrite it.

## Hand back to `hyper` for review and delivery. The marketer produces; it does not ship or gate.
