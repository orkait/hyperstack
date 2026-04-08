import { useLenis } from "lenis/react";

// Read the instance
function MyComponent() {
  const lenis = useLenis();

  function scrollToTop() {
    lenis?.scrollTo(0, { duration: 1.2 });
  }

  return <button onClick={scrollToTop}>Back to top</button>;
}

// Subscribe to scroll events
function ScrollTracker() {
  useLenis(({ scroll, progress, velocity }) => {
    console.log("scroll:", scroll, "progress:", progress);
  });

  return null;
}