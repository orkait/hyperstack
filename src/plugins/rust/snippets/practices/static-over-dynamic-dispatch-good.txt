// Static dispatch — compiler generates specialized code
fn process<T: Processor>(p: T) { p.run(); }

// Dynamic dispatch — needed for mixed types
fn run_all(processors: &[Box<dyn Processor>]) { ... }