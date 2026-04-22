if err := db.Query(ctx, q); err != nil {
  return err // context lost — which query failed?
}