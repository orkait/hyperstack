use std::marker::PhantomData;

struct Connection<State> { addr: String, _state: PhantomData<State> }
struct Disconnected; struct Connected;

impl Connection<Disconnected> {
  fn connect(self) -> Connection<Connected> {
    Connection { addr: self.addr, _state: PhantomData }
  }
}

impl Connection<Connected> {
  fn send(&self, data: &[u8]) { /* only possible when connected */ }
  fn disconnect(self) -> Connection<Disconnected> {
    Connection { addr: self.addr, _state: PhantomData }
  }
}