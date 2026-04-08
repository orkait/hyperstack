// ✅ consumer package defines what it needs
package service

type UserStore interface {
  FindByID(ctx context.Context, id string) (*User, error)
}

type UserService struct { store UserStore }

// ✅ implementing package has no knowledge of the interface
package postgres

type UserRepo struct { db *pgx.Conn }
func (r *UserRepo) FindByID(ctx context.Context, id string) (*User, error) { ... }
// UserRepo satisfies service.UserStore implicitly — no import of service needed