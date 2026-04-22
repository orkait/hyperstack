// Giant interface — forces implementation of everything
type Repository interface {
  Find() []Item; Save(Item) error; Delete(id string) error
  Update(Item) error; Count() int; Exists(id string) bool
}