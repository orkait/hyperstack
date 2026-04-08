const ref = useRef(null);
const isInView = useInView(ref, { once: true });

return <div ref={ref}>{isInView && "Visible!"}</div>;