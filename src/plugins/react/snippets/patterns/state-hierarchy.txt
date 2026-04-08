// 1. URL state (searchParams) — shareable, bookmarkable
const searchParams = useSearchParams();
const sort = searchParams.get("sort") ?? "asc";

// 2. Server state — React Query / SWR / RSC fetch
const { data } = useQuery({ queryKey: ["users"], queryFn: fetchUsers });

// 3. Local component state
const [open, setOpen] = useState(false);

// 4. Shared client state — Zustand
const user = useAuthStore((s) => s.user);

// 5. Context — injection only (theme, auth, i18n, feature flags)
const theme = useContext(ThemeContext);