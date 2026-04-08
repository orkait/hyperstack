// ❌ useEffect for fetching
"use client";
function Component() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch("/api").then(r => r.json()).then(setData); }, []);
}
