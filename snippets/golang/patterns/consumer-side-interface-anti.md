// ❌ producer defines interface — creates import cycle risk
package postgres
type UserStorer interface { FindByID(ctx, id) (*User, error) }
type UserRepo struct{} // implements its own interface