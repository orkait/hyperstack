/* Z-index scale */
@theme {
  --z-base: 0;
  --z-raised: 1;
  --z-dropdown: 1000;
  --z-sticky: 1010;
  --z-fixed: 1020;
  --z-overlay: 1030;     /* modal backdrop */
  --z-modal: 1050;       /* modal content */
  --z-popover: 1060;     /* popovers on top of modal */
  --z-tooltip: 1070;     /* tooltips highest */
  --z-toast: 1080;       /* toast notifications */
  --z-max: 9999;         /* nuclear option — use sparingly */
}

/* Usage in components */
@layer components {
  .dropdown-menu { z-index: var(--z-dropdown); }
  .sticky-header { z-index: var(--z-sticky); }
  .modal-overlay { z-index: var(--z-overlay); }
  .modal-content { z-index: var(--z-modal); }
  .tooltip       { z-index: var(--z-tooltip); }
  .toast         { z-index: var(--z-toast); }
}