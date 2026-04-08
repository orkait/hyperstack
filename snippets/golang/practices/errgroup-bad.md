var wg sync.WaitGroup
wg.Add(2)
go func() { defer wg.Done(); fetchUsers(ctx) }()  // error silently swallowed
go func() { defer wg.Done(); fetchOrders(ctx) }()
wg.Wait()