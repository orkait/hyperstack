const loadFeatures = () =>
  import("motion").then(mod => mod.domMax);

<LazyMotion features={loadFeatures}>
  <m.div drag whileHover={{ scale: 1.1 }} />
</LazyMotion>