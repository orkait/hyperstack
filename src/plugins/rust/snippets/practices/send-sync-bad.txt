use std::rc::Rc;
let data = Rc::new(vec![1, 2, 3]);
// thread::spawn(move || ...data...); // compile error: Rc is not Send