fn parse_config(path: &str) -> Result<Config, ConfigError> {
  let text = fs::read_to_string(path)?;
  toml::from_str(&text).map_err(ConfigError::Parse)
}