import { useState } from "react";
import { useLenis } from "lenis/react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useLenis(({ progress }) => {
    setProgress(progress);
  });

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-blue-500 z-50"
      style={{ width: `${progress * 100}%` }}
    />
  );
}