// ❌ Context for frequently changing state
const CountContext = createContext(0); // re-renders all consumers on every change
