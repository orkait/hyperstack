// Transform function
const doubled = useTransform(() => x.get() * 2);

// Value mapping
const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);

// Color mapping
const color = useTransform(x, [0, 100], ["#f00", "#00f"]);

// Multiple outputs
const { opacity, scale } = useTransform(offset, [0, 600], {
  opacity: [1, 0.4],
  scale: [1, 0.6],
});