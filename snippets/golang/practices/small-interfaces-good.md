// In the consumer package
type Writer interface { Write([]byte) (int, error) }
type Storer interface { Store(ctx context.Context, item Item) error }