use std::sync::Arc;
let data = Arc::new(vec![1, 2, 3]);
let clone = Arc::clone(&data);
thread::spawn(move || println!("{:?}", clone));