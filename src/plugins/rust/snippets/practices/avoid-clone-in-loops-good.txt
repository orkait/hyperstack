let sum: u32 = numbers.iter().sum();          // borrows, no alloc
let upper: Vec<_> = strings.iter().map(|s| s.to_uppercase()).collect();