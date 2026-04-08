import { useLenis } from "lenis/react";

export function Modal({ onClose }: { onClose: () => void }) {
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    return () => lenis?.start();
  }, [lenis]);

  return <div className="modal">{/* modal content */}</div>;
}