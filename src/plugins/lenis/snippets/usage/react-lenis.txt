// Root layout (Next.js App Router)
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ReactLenis root options={{ lerp: 0.1, duration: 1.2 }}>
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}