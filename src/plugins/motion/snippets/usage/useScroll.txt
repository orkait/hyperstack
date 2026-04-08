// Window scroll
const { scrollYProgress } = useScroll();

// Element scroll
const ref = useRef(null);
const { scrollYProgress } = useScroll({ container: ref });

// Track element through viewport
const ref = useRef(null);
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"]
});