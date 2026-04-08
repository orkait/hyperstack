#[expect(clippy::large_enum_variant, reason = "Foo variant is the hot path")]
enum MyEnum { Foo(LargeStruct), Bar(u8) }