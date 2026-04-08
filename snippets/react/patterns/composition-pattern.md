// ✅ Composition — pass JSX as children/slots
function Layout({ sidebar, content }: { sidebar: React.ReactNode; content: React.ReactNode }) {
  return (
    <div className="layout">
      <aside>{sidebar}</aside>
      <main>{content}</main>
    </div>
  );
}

// Usage — no prop drilling
<Layout
  sidebar={<UserSidebar user={user} />}
  content={<ArticleList articles={articles} />}
/>