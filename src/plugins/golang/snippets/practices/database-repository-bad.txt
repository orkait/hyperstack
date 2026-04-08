// ❌ No interface — untestable, tightly coupled to postgres
type UserService struct { db *sql.DB }

func (s *UserService) FindUser(id string) *User {
  // ❌ No context — can't cancel or set deadlines
  // ❌ String concatenation — SQL injection risk
  row := s.db.QueryRow("SELECT * FROM users WHERE id = " + id)
  var u User
  row.Scan(&u.ID, &u.Name) // ❌ error ignored
  return &u
}