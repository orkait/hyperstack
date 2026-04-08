import { snippet } from "./loader.js";

export const RECIPE_CATEGORIES = [
  "crud",
  "websocket",
  "sse",
  "auth",
  "file",
  "tls",
  "middleware",
  "proxy",
  "streaming",
  "graceful-shutdown",
  "http2",
  "testing",
  "routing",
] as const;

export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number];

export interface Recipe {
  name: string;
  category: RecipeCategory;
  description: string;
  when: string;
  code: string;
  gotchas?: string[];
  relatedRecipes?: string[];
}

export interface MiddlewareRef {
  name: string;
  purpose: string;
  usage: string;
  code: string;
  order?: string;
}

// ---------------------------------------------------------------------------
// RECIPES
// ---------------------------------------------------------------------------

export const RECIPES: Recipe[] = [
  {
    name: "hello-world",
    category: "routing",
    description: "Minimal Echo server with a single GET route",
    when: "Starting a new Echo project or verifying your setup",
    code: snippet("recipes/hello-world.txt"),
    gotchas: [
      "e.Logger.Fatal calls os.Exit on error — use it only in main",
      "echo.New() returns a configured instance; always use this, not raw http.Server",
    ],
    relatedRecipes: ["crud-api", "middleware-chain", "graceful-shutdown"],
  },
  {
    name: "crud-api",
    category: "crud",
    description: "Full CRUD REST API with JSON binding and echo.Context",
    when: "Building a resource-oriented REST API with JSON payloads",
    code: snippet("recipes/crud-api.txt"),
    gotchas: [
      "c.Bind() reads Body only once — do not call it twice",
      "Return echo.NewHTTPError for client errors; Echo renders these as JSON automatically",
      "Validate() requires setting e.Validator — wire up a validator like go-playground/validator",
      "PathParamsBinder is the idiomatic way to parse typed path params",
    ],
    relatedRecipes: ["hello-world", "middleware-chain", "route-groups"],
  },
  {
    name: "websocket",
    category: "websocket",
    description: "WebSocket upgrade with read/write loop and proper cleanup",
    when: "Building real-time bidirectional communication (chat, live updates, collaborative tools)",
    code: snippet("recipes/websocket.txt"),
    gotchas: [
      "Always defer ws.Close() immediately after upgrade",
      "WebSocket handler owns the loop — it blocks until the connection closes",
      "echo.Context is NOT goroutine-safe; capture needed values before spawning goroutines",
      "gorilla/websocket is preferred in production over golang.org/x/net/websocket",
      "Set CheckOrigin to validate the request origin in production — never blindly return true",
    ],
    relatedRecipes: ["sse", "graceful-shutdown"],
  },
  {
    name: "sse",
    category: "sse",
    description: "Server-Sent Events with Flush(), content-type header, and client disconnect via context.Done()",
    when: "One-way server-to-client streaming (live logs, dashboards, notifications) without WebSocket overhead",
    code: snippet("recipes/sse.txt"),
    gotchas: [
      "Flush() is REQUIRED after every write — without it data buffers and never reaches the client",
      "SSE format: 'data: <payload>\\n\\n' — double newline terminates the event",
      "Always watch context.Done() to detect client disconnect and stop the loop",
      "Disable Gzip middleware on SSE routes — compression prevents proper streaming",
      "SSE is unidirectional (server → client); use WebSocket for bidirectional",
      "Nginx/proxies may buffer SSE; add 'X-Accel-Buffering: no' header when behind nginx",
    ],
    relatedRecipes: ["websocket", "streaming-response"],
  },
  {
    name: "jwt-auth",
    category: "auth",
    description: "JWT middleware setup, token generation, and protected routes",
    when: "Stateless authentication for REST APIs or microservices",
    code: snippet("recipes/jwt-auth.txt"),
    gotchas: [
      "Always validate alg, iss, aud, and exp when verifying tokens",
      "Use echojwt package (not echo's built-in deprecated JWT) for v4+",
      "jwtSecret must be at least 32 bytes; load from environment variable in production",
      "Never log or return the raw token in error responses",
      "Use bcrypt/argon2 for password comparison — never plain string equality in production",
    ],
    relatedRecipes: ["crud-api", "middleware-chain", "route-groups"],
  },
  {
    name: "cors",
    category: "middleware",
    description: "CORS middleware with configuration for allowed origins, methods, and headers",
    when: "Your API is called from a browser on a different domain",
    code: snippet("recipes/cors.txt"),
    gotchas: [
      "CORS middleware must be registered BEFORE any route handlers",
      "AllowCredentials: true requires explicit origins — wildcard '*' is rejected by browsers",
      "OPTIONS preflight requests must return 200 — Echo handles this automatically with CORS middleware",
      "Do not set both AllowOrigins: ['*'] and AllowCredentials: true — browsers reject this",
    ],
    relatedRecipes: ["middleware-chain", "jwt-auth"],
  },
  {
    name: "graceful-shutdown",
    category: "graceful-shutdown",
    description: "Signal handling with e.Shutdown(ctx) and configurable timeout",
    when: "Production deployments where in-flight requests must complete before shutdown",
    code: snippet("recipes/graceful-shutdown.txt"),
    gotchas: [
      "e.Start() must run in a goroutine; otherwise signal handling never executes",
      "Check for http.ErrServerClosed — it is the normal shutdown error, not a real failure",
      "Timeout should be > your slowest expected request; 10–30s is typical",
      "signal.Notify requires a buffered channel (size 1) to avoid missing signals",
      "In Kubernetes, configure terminationGracePeriodSeconds > your shutdown timeout",
    ],
    relatedRecipes: ["hello-world", "middleware-chain"],
  },
  {
    name: "file-upload",
    category: "file",
    description: "Multipart file upload with c.FormFile(), validation, and disk save",
    when: "Accepting user-uploaded files (images, documents, etc.)",
    code: snippet("recipes/file-upload.txt"),
    gotchas: [
      "Always use filepath.Base() to sanitize filenames — path traversal attacks use '../' sequences",
      "Set BodyLimit middleware AND validate file.Size — both layers of defense",
      "Use a UUID or hash as the stored filename; never trust the client-provided name for storage paths",
      "Close src before dst to ensure all data is flushed",
      "Consider storing to object storage (S3/GCS) instead of local disk in production",
    ],
    relatedRecipes: ["file-download", "middleware-chain"],
  },
  {
    name: "file-download",
    category: "file",
    description: "File download with c.Attachment() (download prompt) and c.Inline() (browser display)",
    when: "Serving files to clients, either as downloads or for inline rendering",
    code: snippet("recipes/file-download.txt"),
    gotchas: [
      "Never use user-supplied filenames directly in file paths — always validate against an allowlist or database",
      "c.Attachment() triggers a download dialog; c.Inline() lets the browser display it",
      "c.File() and c.Static() do not set Content-Disposition — use Attachment/Inline for explicit control",
      "Set appropriate Cache-Control headers for static assets",
    ],
    relatedRecipes: ["file-upload"],
  },
  {
    name: "auto-tls",
    category: "tls",
    description: "Automatic TLS with Let's Encrypt via AutoTLSManager",
    when: "Production server that needs HTTPS without manual certificate management",
    code: snippet("recipes/auto-tls.txt"),
    gotchas: [
      "Requires ports 80 and 443 to be open — Let's Encrypt uses HTTP-01 challenge on port 80",
      "HostWhitelist is REQUIRED to prevent certificate issuance for arbitrary domains",
      "Cache directory must be writable and persistent across restarts",
      "Rate limits apply — don't restart the server repeatedly during testing; use Let's Encrypt staging",
    ],
    relatedRecipes: ["http2", "graceful-shutdown"],
  },
  {
    name: "http2",
    category: "http2",
    description: "HTTP/2 with manual TLS certificate and server push",
    when: "Performance-critical serving where HTTP/2 multiplexing reduces latency",
    code: snippet("recipes/http2.txt"),
    gotchas: [
      "HTTP/2 in browsers requires TLS — plain-text h2c is only for trusted internal networks",
      "Server Push is deprecated in Chrome 106+ and removed in many browsers; prefer preload hints",
      "Use golang.org/x/net/http2 to explicitly configure HTTP/2 settings",
      "Generate self-signed certs for development: openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes",
    ],
    relatedRecipes: ["auto-tls", "graceful-shutdown"],
  },
  {
    name: "middleware-chain",
    category: "middleware",
    description: "Logger → Recover → Auth → Custom middleware chain and why order matters",
    when: "Understanding the execution model of Echo middleware and setting up a production chain",
    code: snippet("recipes/middleware-chain.txt"),
    gotchas: [
      "Logger BEFORE Recover: if Recover is first, panics are caught before Logger sees the request complete",
      "e.Use() registers global middleware; group.Use() registers only for that group",
      "e.Pre() runs middleware before the router — useful for HTTPS redirect, trailing slash removal",
      "Middleware wraps handlers like an onion — request flows inward, response flows outward",
      "echo.Context is NOT goroutine-safe — never pass it to a goroutine; copy values first",
    ],
    relatedRecipes: ["hello-world", "cors", "jwt-auth"],
  },
  {
    name: "reverse-proxy",
    category: "proxy",
    description: "Reverse proxy setup with load balancing to backend targets",
    when: "Fronting backend services, implementing API gateway patterns, or load balancing",
    code: snippet("recipes/reverse-proxy.txt"),
    gotchas: [
      "ProxyWithConfig with RoundRobinBalancer handles load balancing automatically",
      "Set appropriate timeouts on the proxy to avoid hanging connections",
      "Strip or rewrite path prefixes as needed using middleware.Rewrite",
      "X-Forwarded-For and X-Real-IP headers should be passed through to backends",
    ],
    relatedRecipes: ["middleware-chain", "graceful-shutdown"],
  },
  {
    name: "streaming-response",
    category: "streaming",
    description: "Chunked streaming response with explicit Flush() for large or live data",
    when: "Streaming large files, live log tailing, or progressive data delivery",
    code: snippet("recipes/streaming-response.txt"),
    gotchas: [
      "Flush() is MANDATORY — without it the entire response buffers until the handler returns",
      "Do NOT use Gzip middleware on streaming routes — it buffers the entire response",
      "WriteHeader() must be called once before writing body — subsequent calls are no-ops",
      "Check context.Done() in long-running streams to detect client disconnect",
    ],
    relatedRecipes: ["sse", "websocket"],
  },
  {
    name: "route-groups",
    category: "routing",
    description: "e.Group() for resource grouping, API versioning, and scoped middleware",
    when: "Organizing routes by version, resource, or auth requirement",
    code: snippet("recipes/route-groups.txt"),
    gotchas: [
      "Group middleware only applies to routes registered on that group — not the parent",
      "Groups can be nested: v1.Group('/users') creates /v1/users prefix",
      "Middleware registered with group.Use() runs after global middleware from e.Use()",
      "Route parameters in group prefix are accessible in handlers via c.Param()",
    ],
    relatedRecipes: ["middleware-chain", "jwt-auth", "crud-api"],
  },
  {
    name: "timeout",
    category: "middleware",
    description: "Request timeout middleware with context cancellation",
    when: "Enforcing maximum request duration to protect against slow clients or upstream hangs",
    code: snippet("recipes/timeout.txt"),
    gotchas: [
      "Always check context.Done() in handlers — TimeoutMiddleware cancels the context, not the goroutine",
      "Set timeout > your slowest expected operation but < your load balancer's timeout",
      "Different routes may need different timeouts — apply per-group instead of globally",
    ],
    relatedRecipes: ["middleware-chain", "graceful-shutdown"],
  },
  {
    name: "embed-resources",
    category: "file",
    description: "Embed static assets into the binary with //go:embed and serve via http.FS",
    when: "Shipping a self-contained binary with bundled frontend assets, templates, or static files",
    code: snippet("recipes/embed-resources.txt"),
    gotchas: [
      "The //go:embed directive must be in the same package as the variable it annotates",
      "fs.Sub() strips the top-level directory prefix from the embedded FS",
      "Embedded files are read-only — you cannot write to them at runtime",
      "Binary size grows with embedded assets — use only for small/medium asset sets",
    ],
    relatedRecipes: ["file-download", "hello-world"],
  },
  {
    name: "subdomain-routing",
    category: "routing",
    description: "Route requests by subdomain using e.Host() with static or wildcard subdomains",
    when: "Multi-tenant apps, API/admin separation, or white-label subdomain routing",
    code: snippet("recipes/subdomain-routing.txt"),
    gotchas: [
      "e.Host() requires the Host header to match — test with /etc/hosts entries locally",
      "Wildcard subdomain capture uses :subdomain in the host pattern",
      "Ensure DNS wildcard records (*.example.com) are configured in production",
      "Host-based routing runs before path routing — combine with group middleware for auth",
    ],
    relatedRecipes: ["route-groups", "middleware-chain"],
  },
  {
    name: "jsonp",
    category: "routing",
    description: "JSONP response for legacy cross-domain requests using c.JSONP()",
    when: "Supporting legacy clients or environments where CORS is not available",
    code: snippet("recipes/jsonp.txt"),
    gotchas: [
      "JSONP is a legacy technique — prefer CORS for all modern use cases",
      "Always validate the callback parameter — never reflect arbitrary input to avoid XSS",
      "JSONP only supports GET requests — cannot be used for POST/PUT/DELETE",
    ],
    relatedRecipes: ["cors", "crud-api"],
  },
];

// ---------------------------------------------------------------------------
// MIDDLEWARE CATALOG
// ---------------------------------------------------------------------------

export const MIDDLEWARE: MiddlewareRef[] = [
  {
    name: "Logger",
    purpose: "Logs request method, path, status, latency, and bytes",
    usage: "e.Use(middleware.Logger())",
    code: snippet("middleware/logger.txt"),
    order: "FIRST — must be before Recover to log all requests including panics",
  },
  {
    name: "Recover",
    purpose: "Catches panics, logs the stack trace, and returns HTTP 500",
    usage: "e.Use(middleware.Recover())",
    code: snippet("middleware/recover.txt"),
    order: "SECOND — after Logger, before all other middleware",
  },
  {
    name: "CORS",
    purpose: "Sets Cross-Origin Resource Sharing headers",
    usage: "e.Use(middleware.CORSWithConfig(...))",
    code: snippet("middleware/cors.txt"),
    order: "Before auth middleware so OPTIONS preflight requests pass through",
  },
  {
    name: "JWT",
    purpose: "Validates JWT Bearer tokens and sets claims on context",
    usage: "group.Use(echojwt.WithConfig(...))",
    code: snippet("middleware/jwt.txt"),
    order: "After CORS, on protected route groups only",
  },
  {
    name: "CSRF",
    purpose: "Protects against Cross-Site Request Forgery attacks",
    usage: "e.Use(middleware.CSRF())",
    code: snippet("middleware/csrf.txt"),
    order: "After session middleware",
  },
  {
    name: "RateLimiter",
    purpose: "Limits request rate per IP using in-memory store",
    usage: "e.Use(middleware.RateLimiter(...))",
    code: snippet("middleware/rate-limiter.txt"),
    order: "Early in chain — before auth to prevent brute force",
  },
  {
    name: "BasicAuth",
    purpose: "HTTP Basic Authentication",
    usage: "group.Use(middleware.BasicAuth(...))",
    code: snippet("middleware/basic-auth.txt"),
  },
  {
    name: "KeyAuth",
    purpose: "Validates API keys from header, query, or cookie",
    usage: "e.Use(middleware.KeyAuth(...))",
    code: snippet("middleware/key-auth.txt"),
  },
  {
    name: "Gzip",
    purpose: "Compresses responses with gzip encoding",
    usage: "e.Use(middleware.Gzip())",
    code: snippet("middleware/gzip.txt"),
    order: "Do NOT use on SSE or streaming routes — it buffers the entire response",
  },
  {
    name: "Secure",
    purpose: "Sets security headers (HSTS, XSS protection, content type nosniff, etc.)",
    usage: "e.Use(middleware.Secure())",
    code: snippet("middleware/secure.txt"),
  },
  {
    name: "BodyLimit",
    purpose: "Limits request body size to prevent abuse",
    usage: "e.Use(middleware.BodyLimit('2M'))",
    code: snippet("middleware/body-limit.txt"),
    order: "Early in chain, before body reading middleware",
  },
  {
    name: "RequestID",
    purpose: "Attaches a unique X-Request-ID to each request for tracing",
    usage: "e.Use(middleware.RequestID())",
    code: snippet("middleware/request-id.txt"),
  },
  {
    name: "Timeout",
    purpose: "Cancels requests that exceed a time limit",
    usage: "e.Use(middleware.TimeoutWithConfig(...))",
    code: snippet("middleware/timeout.txt"),
  },
];

// ---------------------------------------------------------------------------
// DECISION MATRIX
// ---------------------------------------------------------------------------

export interface DecisionEntry {
  need: string;
  pattern: string;
  recipe: string;
  notes: string;
}

export const DECISION_MATRIX: DecisionEntry[] = [
  { need: "REST API", pattern: "CRUD handlers with JSON", recipe: "crud-api", notes: "Thin handlers, validate with go-playground/validator" },
  { need: "Real-time bidirectional", pattern: "WebSocket", recipe: "websocket", notes: "gorilla/websocket preferred; always defer ws.Close()" },
  { need: "Live push notifications", pattern: "Server-Sent Events", recipe: "sse", notes: "Simpler than WebSocket; unidirectional only; always Flush()" },
  { need: "Authentication", pattern: "JWT middleware", recipe: "jwt-auth", notes: "Use echojwt package; validate alg+iss+aud+exp" },
  { need: "File upload", pattern: "Multipart form", recipe: "file-upload", notes: "Always sanitize filename; use BodyLimit middleware" },
  { need: "File download", pattern: "c.Attachment() or c.Inline()", recipe: "file-download", notes: "Never use user-supplied path directly" },
  { need: "HTTPS", pattern: "AutoTLS or manual TLS", recipe: "auto-tls", notes: "Use auto-tls for Let's Encrypt; manual TLS for http2" },
  { need: "API versioning", pattern: "Route groups", recipe: "route-groups", notes: "e.Group('/v1'), e.Group('/v2') with separate middleware" },
  { need: "Proxy / API gateway", pattern: "Proxy middleware", recipe: "reverse-proxy", notes: "Built-in ProxyMiddleware with RoundRobinBalancer" },
  { need: "Zero-downtime deploy", pattern: "Graceful shutdown", recipe: "graceful-shutdown", notes: "Signal + e.Shutdown(ctx) with 10–30s timeout" },
  { need: "Large response streaming", pattern: "Chunked with Flush()", recipe: "streaming-response", notes: "Disable Gzip on streaming routes" },
  { need: "Cross-origin requests", pattern: "CORS middleware", recipe: "cors", notes: "Register before all routes; AllowCredentials needs explicit origins" },
  { need: "Request timeout", pattern: "Timeout middleware", recipe: "timeout", notes: "Apply per-group for fine-grained control" },
  { need: "Embedded assets", pattern: "go:embed + http.FS", recipe: "embed-resources", notes: "Self-contained binary; read-only; watch binary size" },
  { need: "Multi-tenant subdomains", pattern: "e.Host() routing", recipe: "subdomain-routing", notes: "Requires wildcard DNS; combine with group middleware" },
  { need: "Legacy cross-domain", pattern: "JSONP", recipe: "jsonp", notes: "Avoid in new code; use CORS instead" },
];

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

export function getRecipeByName(name: string): Recipe | undefined {
  return RECIPES.find((r) => r.name.toLowerCase() === name.toLowerCase());
}

export function getRecipesByCategory(category: RecipeCategory): Recipe[] {
  return RECIPES.filter((r) => r.category === category);
}

export function getMiddlewareByName(name: string): MiddlewareRef | undefined {
  return MIDDLEWARE.find((m) => m.name.toLowerCase() === name.toLowerCase());
}

export function searchRecipes(query: string): Recipe[] {
  const q = query.toLowerCase();
  return RECIPES.filter(
    (r) =>
      r.name.includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.when.toLowerCase().includes(q) ||
      r.code.toLowerCase().includes(q) ||
      r.gotchas?.some((g) => g.toLowerCase().includes(q)) ||
      r.category.includes(q)
  );
}

export function searchMiddleware(query: string): MiddlewareRef[] {
  const q = query.toLowerCase();
  return MIDDLEWARE.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.purpose.toLowerCase().includes(q) ||
      m.usage.toLowerCase().includes(q)
  );
}

export function formatRecipe(r: Recipe): string {
  let out = `# ${r.name}\n\n`;
  out += `**Category:** ${r.category}\n`;
  out += `**Description:** ${r.description}\n`;
  out += `**Use when:** ${r.when}\n\n`;
  out += `## Code\n\n\`\`\`go\n${r.code}\n\`\`\`\n\n`;
  if (r.gotchas && r.gotchas.length > 0) {
    out += `## Gotchas\n\n`;
    for (const g of r.gotchas) out += `- ${g}\n`;
    out += "\n";
  }
  if (r.relatedRecipes && r.relatedRecipes.length > 0) {
    out += `## Related Recipes\n\n${r.relatedRecipes.join(", ")}\n`;
  }
  return out;
}

export function formatMiddleware(m: MiddlewareRef): string {
  let out = `# ${m.name} Middleware\n\n`;
  out += `**Purpose:** ${m.purpose}\n`;
  out += `**Usage:** \`${m.usage}\`\n`;
  if (m.order) out += `**Order:** ${m.order}\n`;
  out += `\n## Config Example\n\n\`\`\`go\n${m.code}\n\`\`\`\n`;
  return out;
}
