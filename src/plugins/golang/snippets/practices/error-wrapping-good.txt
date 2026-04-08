if err := db.Query(ctx, q); err != nil {
  return fmt.Errorf("userRepo.FindByID %s: %w", id, err)
}