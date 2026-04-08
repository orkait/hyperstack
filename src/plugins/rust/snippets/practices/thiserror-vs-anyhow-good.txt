// Library
#[derive(thiserror::Error, Debug)]
pub enum ApiError {
  #[error("not found: {0}")] NotFound(String),
  #[error("io error")] Io(#[from] std::io::Error),
}

// Binary/application
fn main() -> anyhow::Result<()> {
  let config = load_config()?; // anyhow adds context automatically
  Ok(())
}