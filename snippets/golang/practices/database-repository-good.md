// Define interface at consumer side
type UserRepository interface {
  FindByID(ctx context.Context, id string) (*User, error)
  Save(ctx context.Context, user *User) error
  Delete(ctx context.Context, id string) error
}

// Postgres implementation
type postgresUserRepo struct { db *pgxpool.Pool }

func (r *postgresUserRepo) FindByID(ctx context.Context, id string) (*User, error) {
  var u User
  err := r.db.QueryRow(ctx,
    "SELECT id, name, email FROM users WHERE id = $1", id,
  ).Scan(&u.ID, &u.Name, &u.Email)
  if errors.Is(err, pgx.ErrNoRows) {
    return nil, ErrNotFound
  }
  if err != nil {
    return nil, fmt.Errorf("userRepo.FindByID: %w", err)
  }
  return &u, nil
}

// Always defer rows.Close()
func (r *postgresUserRepo) List(ctx context.Context) ([]*User, error) {
  rows, err := r.db.Query(ctx, "SELECT id, name, email FROM users")
  if err != nil {
    return nil, fmt.Errorf("userRepo.List: %w", err)
  }
  defer rows.Close()

  var users []*User
  for rows.Next() {
    var u User
    if err := rows.Scan(&u.ID, &u.Name, &u.Email); err != nil {
      return nil, err
    }
    users = append(users, &u)
  }
  return users, rows.Err()
}