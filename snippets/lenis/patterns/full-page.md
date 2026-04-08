// app/layout.tsx (Next.js App Router)
"use client"; // Must be client component

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactLenis root options={{ lerp: 0.1 }}>
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}