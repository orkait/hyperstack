let result: Vec<_> = data
  .iter()
  .filter(|x| x.active)
  .map(|x| x.value * 2)
  .collect(); // one allocation at the end