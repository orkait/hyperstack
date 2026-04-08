type Sorter interface { Sort([]Item) []Item }

type PriceSort struct{}
func (p PriceSort) Sort(items []Item) []Item { /* sort by price */ return items }

type DateSort struct{}
func (d DateSort) Sort(items []Item) []Item { /* sort by date */ return items }

type Catalog struct { sorter Sorter }
func (c *Catalog) List() []Item { return c.sorter.Sort(c.items) }

// Swap at runtime
catalog := &Catalog{sorter: PriceSort{}}