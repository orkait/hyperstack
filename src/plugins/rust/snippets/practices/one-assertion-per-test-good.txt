#[test] fn returns_correct_value() { assert_eq!(add(2, 3), 5); }
#[test] fn handles_overflow() { assert!(add(i32::MAX, 1).is_err()); }