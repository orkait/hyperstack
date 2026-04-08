use std::borrow::Cow;
fn normalize(s: &str) -> Cow<'_, str> {
  if s.chars().all(|c| c.is_lowercase()) {
    Cow::Borrowed(s)         // no allocation when already lowercase
  } else {
    Cow::Owned(s.to_lowercase()) // allocates only when needed
  }
}