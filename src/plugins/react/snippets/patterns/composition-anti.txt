// ❌ Prop drilling — user passed through 3 components
<Page user={user} />
  <Layout user={user} />
    <Sidebar user={user} />
      <Avatar user={user} />
