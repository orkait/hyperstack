// Optimizer plugin - the DSA/algorithm MENU, not the implementations.
//
// Models already know how to write BFS. This catalog exists to make the agent
// RECALL the right technique for a problem and VERIFY its specifics via web
// search, instead of shipping a naive O(n^2) when an O(n) technique exists.
// It carries only stable metadata: name, complexity, the signal that flags the
// problem class, the naive smell it replaces, and a web-search hint for the
// authoritative implementation. No code lives here on purpose.

export const ALGO_CLASSES = [
  "arrays-strings", "hashing", "sorting", "binary-search", "linked-list",
  "stack-queue", "trees", "heap-pq", "graphs", "dp", "greedy",
  "backtracking", "bit", "math", "intervals", "tries", "strings-advanced",
  "ds-design",
] as const;
export type AlgoClass = (typeof ALGO_CLASSES)[number];

export interface Technique {
  name: string;
  class: AlgoClass;
  time: string;
  space: string;
  when: string;      // the signal that this technique fits the problem
  replaces: string;  // the naive smell it lifts (the optimizer's teeth)
  websearch: string; // query hint for the authoritative impl + edge cases
}

export interface ProblemSignal {
  class: AlgoClass;
  signals: string[];   // lowercase keywords/phrases that flag this class
  candidates: string[]; // technique names to consider
}

export const TECHNIQUES: Technique[] = [
  // ARRAYS / STRINGS
  { name: "two-pointer-opposite", class: "arrays-strings", time: "O(n)", space: "O(1)", when: "sorted array, find pair/triplet to target, reverse, palindrome check", replaces: "nested-loop O(n^2) pair search", websearch: "two pointer technique opposite ends" },
  { name: "two-pointer-same-direction", class: "arrays-strings", time: "O(n)", space: "O(1)", when: "in-place filter/partition, remove duplicates from sorted", replaces: "extra array O(n) or O(n^2) shifting", websearch: "fast slow two pointer remove duplicates in place" },
  { name: "sliding-window-fixed", class: "arrays-strings", time: "O(n)", space: "O(1)", when: "max/sum/avg over fixed-size-k subarray", replaces: "recompute each window O(n*k)", websearch: "fixed size sliding window" },
  { name: "sliding-window-variable", class: "arrays-strings", time: "O(n)", space: "O(k)", when: "longest/shortest subarray or substring under a constraint", replaces: "nested-loop O(n^2) substring scan", websearch: "variable size sliding window longest substring" },
  { name: "prefix-sum", class: "arrays-strings", time: "O(n) build, O(1) query", space: "O(n)", when: "many range-sum / range-aggregate queries on static data", replaces: "recompute range each query O(n) per query", websearch: "prefix sum array range query" },
  { name: "kadane", class: "arrays-strings", time: "O(n)", space: "O(1)", when: "maximum subarray sum", replaces: "O(n^2) all-subarrays scan", websearch: "Kadane algorithm maximum subarray" },
  { name: "dutch-national-flag", class: "arrays-strings", time: "O(n)", space: "O(1)", when: "3-way partition / sort 0s-1s-2s in one pass", replaces: "full sort O(n log n) for only 3 categories", websearch: "Dutch national flag three way partition" },

  // HASHING
  { name: "hash-set-dedup", class: "hashing", time: "O(n)", space: "O(n)", when: "membership / dedup / seen-before on unsorted data", replaces: "nested-loop O(n^2) dedup", websearch: "hash set deduplication pattern" },
  { name: "hash-map-frequency", class: "hashing", time: "O(n)", space: "O(n)", when: "counting, anagrams, group-by, first-unique", replaces: "repeated linear scans O(n^2)", websearch: "frequency counter hashmap" },
  { name: "two-sum-hashmap", class: "hashing", time: "O(n)", space: "O(n)", when: "find pair summing to target in UNSORTED data", replaces: "nested-loop O(n^2)", websearch: "two sum hashmap one pass" },

  // SORTING
  { name: "introsort", class: "sorting", time: "O(n log n)", space: "O(log n)", when: "general-purpose comparison sort (most stdlib sorts)", replaces: "bubble/insertion/selection O(n^2)", websearch: "introsort quicksort heapsort hybrid" },
  { name: "merge-sort", class: "sorting", time: "O(n log n)", space: "O(n)", when: "stable sort needed, linked lists, external/streamed sort", replaces: "O(n^2) sorts; unstable quicksort when stability matters", websearch: "merge sort stable" },
  { name: "counting-sort", class: "sorting", time: "O(n+k)", space: "O(k)", when: "integer keys in a small known range k", replaces: "comparison sort O(n log n) when range is small", websearch: "counting sort" },
  { name: "radix-sort", class: "sorting", time: "O(d*(n+k))", space: "O(n+k)", when: "fixed-width integer or string keys", replaces: "comparison sort O(n log n)", websearch: "radix sort LSD" },
  { name: "bucket-sort", class: "sorting", time: "O(n) avg", space: "O(n)", when: "uniformly distributed floats in a range", replaces: "comparison sort O(n log n)", websearch: "bucket sort uniform distribution" },

  // BINARY SEARCH
  { name: "binary-search", class: "binary-search", time: "O(log n)", space: "O(1)", when: "search in a sorted collection", replaces: "linear scan O(n)", websearch: "binary search" },
  { name: "lower-upper-bound", class: "binary-search", time: "O(log n)", space: "O(1)", when: "first/last position, insertion point, count of value", replaces: "linear scan O(n)", websearch: "lower bound upper bound binary search" },
  { name: "binary-search-on-answer", class: "binary-search", time: "O(n log(range))", space: "O(1)", when: "minimize-the-max / maximize-the-min with a monotone feasibility check", replaces: "brute force over the answer space", websearch: "binary search on answer parametric search" },
  { name: "search-rotated", class: "binary-search", time: "O(log n)", space: "O(1)", when: "search in a rotated sorted array", replaces: "linear scan O(n)", websearch: "search in rotated sorted array" },

  // LINKED LIST
  { name: "fast-slow-pointer", class: "linked-list", time: "O(n)", space: "O(1)", when: "cycle detection, find middle, nth-from-end", replaces: "two passes or extra storage O(n)", websearch: "Floyd cycle detection fast slow pointer" },
  { name: "linked-list-reversal", class: "linked-list", time: "O(n)", space: "O(1)", when: "reverse a list or sublist in place", replaces: "copy to array O(n) space", websearch: "reverse linked list in place" },

  // STACK / QUEUE
  { name: "monotonic-stack", class: "stack-queue", time: "O(n)", space: "O(n)", when: "next/previous greater-or-smaller element, largest rectangle in histogram", replaces: "nested-loop O(n^2)", websearch: "monotonic stack next greater element" },
  { name: "monotonic-deque", class: "stack-queue", time: "O(n)", space: "O(k)", when: "sliding window maximum/minimum", replaces: "recompute each window O(n*k) or heap O(n log k)", websearch: "monotonic deque sliding window maximum" },
  { name: "min-max-stack", class: "stack-queue", time: "O(1) per op", space: "O(n)", when: "track running min/max alongside a stack", replaces: "recompute min O(n)", websearch: "min stack constant time minimum" },

  // TREES
  { name: "tree-dfs", class: "trees", time: "O(n)", space: "O(h)", when: "traversal (in/pre/post-order), path sums, height, validate", replaces: "ad-hoc recursion without structure", websearch: "binary tree DFS recursive iterative" },
  { name: "tree-bfs-level", class: "trees", time: "O(n)", space: "O(w)", when: "level-order, min-depth, right-side view, shortest path in a tree", replaces: "DFS then post-process levels", websearch: "binary tree level order BFS queue" },
  { name: "bst-operations", class: "trees", time: "O(h)", space: "O(h)", when: "ordered insert/search/delete, range queries on ordered data", replaces: "linear scan O(n) of an unsorted structure", websearch: "binary search tree operations balanced" },
  { name: "lowest-common-ancestor", class: "trees", time: "O(n) / O(log n) with prep", space: "O(h)", when: "LCA of two nodes, distance between nodes", replaces: "naive root-to-node path compare", websearch: "lowest common ancestor binary tree binary lifting" },

  // HEAP / PRIORITY QUEUE
  { name: "heap-top-k", class: "heap-pq", time: "O(n log k)", space: "O(k)", when: "k largest/smallest, k-th element", replaces: "full sort O(n log n)", websearch: "top k elements min heap" },
  { name: "merge-k-sorted", class: "heap-pq", time: "O(n log k)", space: "O(k)", when: "merge k sorted lists/streams", replaces: "concatenate then sort O(n log n)", websearch: "merge k sorted lists heap" },
  { name: "two-heaps-median", class: "heap-pq", time: "O(log n) insert, O(1) query", space: "O(n)", when: "running median of a stream", replaces: "sort on every query O(n log n)", websearch: "find median from data stream two heaps" },

  // GRAPHS
  { name: "graph-bfs", class: "graphs", time: "O(V+E)", space: "O(V)", when: "shortest path in UNWEIGHTED graph, levels, nearest", replaces: "DFS then take min, or repeated scans", websearch: "graph BFS shortest path unweighted" },
  { name: "graph-dfs", class: "graphs", time: "O(V+E)", space: "O(V)", when: "connectivity, cycle detection, path existence, flood fill", replaces: "ad-hoc recursion", websearch: "graph DFS cycle detection" },
  { name: "topological-sort", class: "graphs", time: "O(V+E)", space: "O(V)", when: "dependency / build order on a DAG, course schedule", replaces: "guessing order or repeated passes", websearch: "topological sort Kahn algorithm" },
  { name: "dijkstra", class: "graphs", time: "O(E log V)", space: "O(V)", when: "shortest path with NON-NEGATIVE weights", replaces: "Bellman-Ford O(VE) when no negatives", websearch: "Dijkstra shortest path priority queue" },
  { name: "bellman-ford", class: "graphs", time: "O(VE)", space: "O(V)", when: "shortest path with NEGATIVE edges, negative-cycle detection", replaces: "Dijkstra (which is wrong with negatives)", websearch: "Bellman-Ford negative weight edges" },
  { name: "floyd-warshall", class: "graphs", time: "O(V^3)", space: "O(V^2)", when: "ALL-PAIRS shortest path on a small/dense graph", replaces: "running Dijkstra from every node", websearch: "Floyd Warshall all pairs shortest path" },
  { name: "union-find", class: "graphs", time: "~O(alpha(n)) per op", space: "O(n)", when: "dynamic connectivity, cycle in undirected, grouping, Kruskal", replaces: "BFS/DFS per connectivity query O(V+E)", websearch: "union find disjoint set union path compression rank" },
  { name: "mst-kruskal-prim", class: "graphs", time: "O(E log V)", space: "O(V)", when: "minimum spanning tree (Kruskal sparse, Prim dense)", replaces: "brute force spanning trees", websearch: "minimum spanning tree Kruskal Prim" },
  { name: "tarjan-scc", class: "graphs", time: "O(V+E)", space: "O(V)", when: "strongly connected components, 2-SAT, condensation", replaces: "naive reachability O(V*(V+E))", websearch: "Tarjan strongly connected components" },

  // DYNAMIC PROGRAMMING
  { name: "dp-memoization", class: "dp", time: "O(states * transition)", space: "O(states)", when: "overlapping subproblems, optimal substructure, top-down", replaces: "exponential plain recursion (e.g. recursive Fibonacci)", websearch: "memoization top down dynamic programming" },
  { name: "dp-tabulation", class: "dp", time: "O(states * transition)", space: "O(states), often O(width)", when: "bottom-up DP, when iteration order is clear and space can be rolled", replaces: "exponential recursion; deep recursion stack", websearch: "tabulation bottom up dynamic programming space optimization" },
  { name: "knapsack-01", class: "dp", time: "O(n*W)", space: "O(W)", when: "pick subset under a capacity/weight budget", replaces: "exponential 2^n subset enumeration", websearch: "0/1 knapsack dynamic programming" },
  { name: "lis", class: "dp", time: "O(n log n)", space: "O(n)", when: "longest increasing subsequence and variants", replaces: "O(n^2) DP or O(2^n) brute force", websearch: "longest increasing subsequence patience sorting binary search" },
  { name: "lcs-edit-distance", class: "dp", time: "O(n*m)", space: "O(min(n,m))", when: "sequence alignment, diff, edit distance, similarity", replaces: "exponential recursion", websearch: "edit distance longest common subsequence DP" },
  { name: "coin-change", class: "dp", time: "O(n*amount)", space: "O(amount)", when: "min coins / number of ways to make a sum", replaces: "exponential recursion", websearch: "coin change dynamic programming" },
  { name: "bitmask-dp", class: "dp", time: "O(2^n * n)", space: "O(2^n)", when: "small-n (<=20) subset states: TSP, assignment, set cover", replaces: "brute force n! permutations", websearch: "bitmask DP traveling salesman assignment" },
  { name: "interval-dp", class: "dp", time: "O(n^3)", space: "O(n^2)", when: "matrix-chain, burst balloons, optimal merge over intervals", replaces: "exponential recursion", websearch: "interval DP matrix chain multiplication" },

  // GREEDY
  { name: "interval-scheduling", class: "greedy", time: "O(n log n)", space: "O(1)", when: "max non-overlapping intervals (sort by earliest finish)", replaces: "brute force / DP when greedy is provably optimal", websearch: "interval scheduling greedy earliest finish time" },
  { name: "activity-exchange-argument", class: "greedy", time: "O(n log n)", space: "O(1)", when: "selection/ordering where a local optimal choice is provably global", replaces: "DP/brute force when an exchange argument holds", websearch: "greedy exchange argument activity selection" },
  { name: "huffman-coding", class: "greedy", time: "O(n log n)", space: "O(n)", when: "optimal prefix codes, minimum-cost merge of items", replaces: "fixed-length encoding / brute force merge order", websearch: "Huffman coding greedy priority queue" },

  // BACKTRACKING
  { name: "backtracking-enumerate", class: "backtracking", time: "O(2^n) / O(n!)", space: "O(n)", when: "all subsets, combinations, permutations", replaces: "ad-hoc nested loops that do not generalize", websearch: "backtracking subsets combinations permutations" },
  { name: "backtracking-prune", class: "backtracking", time: "exponential with pruning", space: "O(n)", when: "constraint search: N-queens, sudoku, word search", replaces: "brute force over all configurations", websearch: "backtracking constraint pruning N queens sudoku" },

  // BIT MANIPULATION
  { name: "bit-tricks", class: "bit", time: "O(1)", space: "O(1)", when: "flags/sets, parity, power-of-two test, lowest set bit, count bits", replaces: "loops and arithmetic for set membership", websearch: "bit manipulation tricks cheat sheet" },
  { name: "xor-find-unique", class: "bit", time: "O(n)", space: "O(1)", when: "find the single/missing number among pairs", replaces: "hashing O(n) space", websearch: "XOR find single number missing number" },
  { name: "subset-enumeration-bitmask", class: "bit", time: "O(2^n)", space: "O(1)", when: "iterate all subsets of a small set", replaces: "recursive subset generation", websearch: "iterate all subsets bitmask submask enumeration" },

  // MATH / NUMBER THEORY
  { name: "euclid-gcd", class: "math", time: "O(log min(a,b))", space: "O(1)", when: "gcd/lcm, simplify fractions, periodicity", replaces: "naive factor loop", websearch: "Euclidean algorithm GCD" },
  { name: "sieve-of-eratosthenes", class: "math", time: "O(n log log n)", space: "O(n)", when: "all primes up to n, smallest prime factor", replaces: "trial division per number O(n*sqrt(n))", websearch: "Sieve of Eratosthenes primes" },
  { name: "modular-exponentiation", class: "math", time: "O(log e)", space: "O(1)", when: "a^e mod m for large e (hashing, crypto, combinatorics mod p)", replaces: "naive O(e) multiply loop", websearch: "modular exponentiation fast power binary exponentiation" },

  // INTERVALS
  { name: "merge-intervals", class: "intervals", time: "O(n log n)", space: "O(n)", when: "merge overlapping intervals, insert interval", replaces: "nested-loop O(n^2) overlap checks", websearch: "merge intervals sort by start" },
  { name: "sweep-line", class: "intervals", time: "O(n log n)", space: "O(n)", when: "max concurrent intervals, meeting rooms, skyline, segment overlaps", replaces: "brute force check at every point", websearch: "sweep line algorithm events intervals" },

  // TRIES
  { name: "trie-prefix", class: "tries", time: "O(L) per op", space: "O(alphabet * total length)", when: "prefix search, autocomplete, dictionary of words, word break", replaces: "scanning all words per query, repeated string compares", websearch: "trie prefix tree autocomplete" },
  { name: "xor-trie", class: "tries", time: "O(L) per op", space: "O(N * L)", when: "maximum XOR pair, XOR range queries", replaces: "O(n^2) pair comparison", websearch: "XOR trie maximum xor of two numbers" },

  // ADVANCED STRINGS
  { name: "kmp", class: "strings-advanced", time: "O(n+m)", space: "O(m)", when: "single-pattern substring search, prefix-function uses", replaces: "naive substring search O(n*m)", websearch: "KMP string matching prefix function" },
  { name: "rabin-karp", class: "strings-advanced", time: "O(n+m) avg", space: "O(1)", when: "substring search, multiple patterns, rolling hash dedup of substrings", replaces: "naive O(n*m)", websearch: "Rabin-Karp rolling hash substring" },
  { name: "z-algorithm", class: "strings-advanced", time: "O(n)", space: "O(n)", when: "pattern matching, string periodicity, distinct substrings", replaces: "naive O(n*m)", websearch: "Z algorithm string matching" },

  // DATA-STRUCTURE DESIGN
  { name: "lru-cache", class: "ds-design", time: "O(1) get/put", space: "O(capacity)", when: "bounded cache with least-recently-used eviction", replaces: "linear scan to find eviction victim O(n)", websearch: "LRU cache hashmap doubly linked list ordered map" },
  { name: "fenwick-bit", class: "ds-design", time: "O(log n) per op", space: "O(n)", when: "prefix sums / point updates that interleave", replaces: "recompute prefix O(n) per update", websearch: "Fenwick tree binary indexed tree" },
  { name: "segment-tree", class: "ds-design", time: "O(log n) per op", space: "O(n)", when: "range query + range update (sum/min/max/gcd), lazy propagation", replaces: "recompute range O(n) per query", websearch: "segment tree lazy propagation range query" },
  { name: "sparse-table", class: "ds-design", time: "O(1) query, O(n log n) build", space: "O(n log n)", when: "STATIC idempotent range query (min/max/gcd), RMQ", replaces: "O(n) per query or O(log n) segment tree when data is static", websearch: "sparse table range minimum query" },
];

export const PROBLEM_SIGNALS: ProblemSignal[] = [
  { class: "arrays-strings", signals: ["sorted array", "pair sum", "two sum sorted", "subarray", "substring", "palindrome", "reverse in place", "max subarray", "contiguous", "window", "range sum"], candidates: ["two-pointer-opposite", "two-pointer-same-direction", "sliding-window-fixed", "sliding-window-variable", "prefix-sum", "kadane"] },
  { class: "hashing", signals: ["duplicate", "dedup", "seen before", "count occurrences", "frequency", "anagram", "group by", "unsorted pair", "two sum"], candidates: ["hash-set-dedup", "hash-map-frequency", "two-sum-hashmap"] },
  { class: "sorting", signals: ["sort", "order by", "small integer range", "rank", "kth after sort"], candidates: ["introsort", "merge-sort", "counting-sort", "radix-sort", "bucket-sort"] },
  { class: "binary-search", signals: ["sorted search", "find position", "insertion point", "minimize the maximum", "maximize the minimum", "rotated array", "feasible threshold", "monotonic"], candidates: ["binary-search", "lower-upper-bound", "binary-search-on-answer", "search-rotated"] },
  { class: "linked-list", signals: ["linked list", "cycle", "middle node", "nth from end", "reverse list"], candidates: ["fast-slow-pointer", "linked-list-reversal"] },
  { class: "stack-queue", signals: ["next greater", "previous smaller", "histogram", "valid parentheses", "sliding window max", "monotonic"], candidates: ["monotonic-stack", "monotonic-deque", "min-max-stack"] },
  { class: "trees", signals: ["tree", "binary tree", "traversal", "level order", "ancestor", "subtree", "bst", "in-order"], candidates: ["tree-dfs", "tree-bfs-level", "bst-operations", "lowest-common-ancestor"] },
  { class: "heap-pq", signals: ["k largest", "k smallest", "top k", "kth", "merge sorted lists", "running median", "priority", "schedule by priority"], candidates: ["heap-top-k", "merge-k-sorted", "two-heaps-median"] },
  { class: "graphs", signals: ["graph", "grid path", "shortest path", "connected components", "dependency", "course schedule", "weighted edges", "negative weight", "all pairs", "spanning tree", "island", "flood fill"], candidates: ["graph-bfs", "graph-dfs", "topological-sort", "dijkstra", "bellman-ford", "floyd-warshall", "union-find", "mst-kruskal-prim", "tarjan-scc"] },
  { class: "dp", signals: ["overlapping subproblems", "min cost", "max value", "number of ways", "longest", "edit distance", "knapsack", "subsequence", "optimal substructure", "exponential recursion"], candidates: ["dp-memoization", "dp-tabulation", "knapsack-01", "lis", "lcs-edit-distance", "coin-change", "bitmask-dp", "interval-dp"] },
  { class: "greedy", signals: ["intervals non-overlapping", "earliest finish", "minimum number of", "select maximum", "merge cost", "prefix code"], candidates: ["interval-scheduling", "activity-exchange-argument", "huffman-coding"] },
  { class: "backtracking", signals: ["all combinations", "all permutations", "all subsets", "generate all", "n-queens", "sudoku", "word search", "constraint"], candidates: ["backtracking-enumerate", "backtracking-prune"] },
  { class: "bit", signals: ["bitmask", "xor", "single number", "missing number", "power of two", "set bits", "parity"], candidates: ["bit-tricks", "xor-find-unique", "subset-enumeration-bitmask"] },
  { class: "math", signals: ["gcd", "lcm", "prime", "sieve", "modulo", "power mod", "combinatorics"], candidates: ["euclid-gcd", "sieve-of-eratosthenes", "modular-exponentiation"] },
  { class: "intervals", signals: ["intervals", "overlap", "meeting rooms", "merge ranges", "skyline", "max concurrent"], candidates: ["merge-intervals", "sweep-line"] },
  { class: "tries", signals: ["prefix", "autocomplete", "dictionary of words", "word break", "maximum xor pair"], candidates: ["trie-prefix", "xor-trie"] },
  { class: "strings-advanced", signals: ["substring search", "pattern matching", "string periodicity", "find pattern in text", "rolling hash"], candidates: ["kmp", "rabin-karp", "z-algorithm"] },
  { class: "ds-design", signals: ["design a cache", "lru", "range query with updates", "range update", "prefix sum with updates", "rmq"], candidates: ["lru-cache", "fenwick-bit", "segment-tree", "sparse-table"] },
];

export function getTechnique(name: string): Technique | undefined {
  return TECHNIQUES.find((t) => t.name.toLowerCase() === name.toLowerCase());
}

export function techniquesByClass(cls: AlgoClass): Technique[] {
  return TECHNIQUES.filter((t) => t.class === cls);
}

export interface ProblemMatch {
  class: AlgoClass;
  matchedSignals: string[];
  candidates: string[];
}

export function matchProblem(text: string): ProblemMatch[] {
  const hay = text.toLowerCase();
  const matches: ProblemMatch[] = [];
  for (const ps of PROBLEM_SIGNALS) {
    const hit = ps.signals.filter((s) => hay.includes(s));
    if (hit.length > 0) {
      matches.push({ class: ps.class, matchedSignals: hit, candidates: ps.candidates });
    }
  }
  return matches.sort((a, b) => b.matchedSignals.length - a.matchedSignals.length);
}

export function searchTechniques(query: string): Technique[] {
  const q = query.toLowerCase();
  return TECHNIQUES.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.class.includes(q) ||
      t.when.toLowerCase().includes(q) ||
      t.replaces.toLowerCase().includes(q),
  );
}
