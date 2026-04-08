<!-- Prevent Lenis smooth scroll on specific elements -->

<!-- Prevent all scroll events -->
<div data-lenis-prevent>
  <!-- scrolls natively, not through Lenis -->
</div>

<!-- Prevent wheel events only -->
<div data-lenis-prevent-wheel>...</div>

<!-- Prevent touch events only -->
<div data-lenis-prevent-touch>...</div>

<!-- Programmatic control -->
lenis?.stop()   // pause Lenis (e.g. modal open)
lenis?.start()  // resume Lenis (e.g. modal close)
