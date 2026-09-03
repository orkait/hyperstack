# Operations Baseline

What every service owes its operators, independent of language and framework. The language-specific
form of these lives in the stack skills; the requirement lives here.

## Logs are structured, for humans and machines

```
log.info("order_placed", order_id=order.id, user_id=user.id, total_cents=4200, duration_ms=87)
```

not `print("order placed for " + user.name)`. An event name plus typed fields can be filtered,
aggregated, and alerted on. An interpolated sentence can only be read.

Rules that hold everywhere:

| Rule | Reason |
|---|---|
| One correlation id per request, propagated to every downstream call | It is what turns a user's report into a log query |
| No secrets, tokens, or full request bodies with personal data | Logs are copied to places with different access rules |
| Never a silent catch | An exception with no log and no rethrow is an outage with no evidence |
| Log at the boundary that can add context, then rethrow | Context is lost the further from the failure you log |

## Metrics for behavior, logs for diagnosis

Alert on metrics: counts, latencies, error rates, saturation. Investigate with logs. A dashboard built
from log searches is expensive and slow, and an alert built on a log grep fires late.

The minimum for a request-serving process: request rate, error rate, latency distribution (not the
mean), and one saturation signal such as queue depth or pool utilization.

## Liveness and readiness are different questions

| Endpoint | Question | Touches |
|---|---|---|
| `/health` | Is the process alive? | Nothing |
| `/ready` | Can it serve traffic? | Its required dependencies, cheaply, with a timeout |

Wiring the database into liveness means one slow query restarts every instance at once, which converts
a degradation into an outage. Readiness without a timeout is a probe that hangs, which is a probe that
fails.

## Degrade, do not collapse

When a non-critical dependency fails, serve less rather than nothing: cached results, defaults, a
reduced feature. Decide per dependency, in advance, which of the three it is:

| Class | On failure |
|---|---|
| Required | Fail the request with a clear error |
| Degradable | Serve the fallback and record that it happened |
| Optional | Skip it silently, count it |

The recommendation service being down should cost the carousel, not the page. Every outbound call also
carries an explicit timeout: "wait forever" is how one slow dependency saturates a worker pool.

## Configuration over code branches

What varies between environments is configuration. An `if environment == "production"` branch means the
code path that runs in production is not the code path anyone tested.

## Magic numbers and strings are configuration that escaped

```
if status == 3          ->  if status == OrderStatus.SHIPPED
sleep(300)              ->  sleep(RETRY_BACKOFF_SECONDS)
```

A literal in the middle of logic cannot be searched for, cannot be changed in one place, and carries no
statement of what it means. Named constants, enums, or config, chosen by whether the value varies by
deploy.

## The N+1 shape

One query for the list, then one per row. It is the most common performance defect in
data-backed services and it never shows up on a development dataset of twenty rows.

Fix at the query: batch, join, or eager-load. Detect it by asserting query counts in tests for the
endpoints that matter, because it regresses through unrelated changes.

For deriving the complexity of a hot path and choosing a better algorithm, use `hyperstack:optimizer`.
This rule is only the shape to recognize.
