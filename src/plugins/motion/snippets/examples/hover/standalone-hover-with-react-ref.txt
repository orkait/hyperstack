import { hover } from "motion"
import { useRef, useEffect } from "react"

function HoverButton() {
  const ref = useRef(null);

  useEffect(() => {
    return hover(ref.current, () => {
      ref.current.style.scale = "1.1";
      return () => { ref.current.style.scale = "1"; };
    });
  }, []);

  return <button ref={ref}>Hover me</button>;
}