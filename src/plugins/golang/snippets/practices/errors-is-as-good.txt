if errors.Is(err, ErrNotFound) { ... }
var dbErr *DBError
if errors.As(err, &dbErr) { ... }