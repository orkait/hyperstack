/* Card variants */
.card {
  background: var(--color-surface);
  border-radius: var(--radius-card, 0.5rem);
  padding: clamp(1.25rem, 2vw, 1.75rem);
}

.card-interactive {
  cursor: pointer;
  transition: box-shadow 150ms ease-out, transform 150ms ease-out;
}
.card-interactive:hover {
  box-shadow: 0 4px 12px oklch(0.30 0.02 60 / 0.12);
  transform: translateY(-1px);
}
.card-interactive:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}