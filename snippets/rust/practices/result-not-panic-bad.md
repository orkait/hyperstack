fn parse_config(path: &str) -> Config {
  let text = fs::read_to_string(path).unwrap(); // panics if file missing
  toml::from_str(&text).unwrap()
}