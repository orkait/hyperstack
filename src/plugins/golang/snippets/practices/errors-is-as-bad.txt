if err == ErrNotFound { ... }   // breaks with wrapped errors
if _, ok := err.(*DBError); ok { ... } // type assertion breaks wrapping