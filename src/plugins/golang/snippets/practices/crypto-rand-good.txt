import "crypto/rand"
token := make([]byte, 32)
rand.Read(token)