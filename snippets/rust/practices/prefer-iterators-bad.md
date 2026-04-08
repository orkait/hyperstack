let filtered: Vec<_> = data.iter().filter(|x| x.active).collect(); // alloc
let result: Vec<_> = filtered.iter().map(|x| x.value * 2).collect();    // alloc again