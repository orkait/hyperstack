# .golangci.yml — recommended production configuration
linters:
  enable:
    - errcheck       # ensure errors are handled
    - gosimple       # simplification suggestions
    - govet          # suspicious constructs
    - ineffassign    # unused assignments
    - staticcheck    # advanced static analysis
    - unused         # unused code
    - gofmt          # formatting
    - goimports      # import ordering
    - gosec          # security issues
    - revive         # opinionated linter
    - bodyclose      # HTTP response body not closed
    - noctx          # HTTP requests without context
    - exhaustive     # exhaustive enum switches

linters-settings:
  errcheck:
    check-type-assertions: true
  gosec:
    excludes:
      - G104  # only if intentional error suppression

run:
  timeout: 5m
  go: "1.21"