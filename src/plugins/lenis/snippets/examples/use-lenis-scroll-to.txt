import { useLenis } from "lenis/react";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const lenis = useLenis();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    lenis?.scrollTo(href, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
  }

  return <a href={href} onClick={handleClick}>{children}</a>;
}