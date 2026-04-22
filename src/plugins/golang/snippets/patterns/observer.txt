// Observer using channels — idiomatic Go over callbacks
type Event struct {
  Type    string
  Payload any
}

type EventBus struct {
  mu          sync.RWMutex
  subscribers []chan Event
}

func (b *EventBus) Subscribe() <-chan Event {
  ch := make(chan Event, 10) // buffered to avoid blocking publisher
  b.mu.Lock()
  b.subscribers = append(b.subscribers, ch)
  b.mu.Unlock()
  return ch
}

func (b *EventBus) Publish(e Event) {
  b.mu.RLock()
  defer b.mu.RUnlock()
  for _, ch := range b.subscribers {
    select {
    case ch <- e:
    default: // drop if subscriber is full — or use blocking if required
    }
  }
}

func (b *EventBus) Close() {
  b.mu.Lock()
  defer b.mu.Unlock()
  for _, ch := range b.subscribers { close(ch) }
}

// Usage
bus := &EventBus{}
events := bus.Subscribe()
go func() {
  for e := range events {
    fmt.Printf("received: %s\n", e.Type)
  }
}()
bus.Publish(Event{Type: "user.created", Payload: userID})