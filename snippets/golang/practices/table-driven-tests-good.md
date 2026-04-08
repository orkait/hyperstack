func TestAdd(t *testing.T) {
  tests := []struct {
    name     string
    a, b     int
    expected int
  }{
    {"positive", 2, 3, 5},
    {"negative", -1, -2, -3},
    {"zero", 0, 0, 0},
  }
  for _, tc := range tests {
    t.Run(tc.name, func(t *testing.T) {
      if got := Add(tc.a, tc.b); got != tc.expected {
        t.Errorf("Add(%d,%d) = %d, want %d", tc.a, tc.b, got, tc.expected)
      }
    })
  }
}