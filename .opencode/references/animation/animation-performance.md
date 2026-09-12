# Animation Performance

## GPU vs CPU

| Property | Compositor (GPU) | Layout (CPU) | Paint (CPU) |
|----------|-----------------|--------------|-------------|
| `transform` | ✅ | ❌ | ❌ |
| `opacity` | ✅ | ❌ | ❌ |
| `filter` | ✅ (with `will-change`) | ❌ | ❌ |
| `clip-path` | ✅ (with `will-change`) | ❌ | ❌ |
| `width`/`height` | ❌ | ✅ | ✅ |
| `top`/`left` | ❌ | ✅ | ✅ |
| `margin`/`padding` | ❌ | ✅ | ✅ |
| `color`/`background` | ❌ | ❌ | ✅ |
| `box-shadow` | ❌ | ❌ | ✅ |

**Rule**: Only animate `transform` and `opacity` for 60fps.

## will-change Property

```css
/* Good: hint before animation starts */
.element {
  will-change: transform, opacity;
}

/* Bad: overusing will-change (wastes memory) */
.everything {
  will-change: transform, opacity, filter, clip-path; /* Don't */
}

/* Best: use via JS, remove when done */
function startAnimation(el: HTMLElement) {
  el.style.willChange = 'transform';
  requestAnimationFrame(() => {
    el.classList.add('animating');
  });
}

function endAnimation(el: HTMLElement) {
  el.classList.remove('animating');
  el.style.willChange = 'auto';
}
```

## Transform/Opacity Only

```css
/* ✅ Good: GPU-composited */
.card {
  transition: transform 250ms ease, opacity 250ms ease;
}
.card:hover {
  transform: translateY(-4px) scale(1.02);
  opacity: 0.9;
}

/* ❌ Bad: triggers layout + paint */
.card {
  transition: all 250ms ease;
}
.card:hover {
  margin-top: -4px;
  width: 102%;
}
```

## RAF vs setTimeout

```typescript
// ❌ Bad: setTimeout for animation
setTimeout(() => {
  element.style.transform = 'translateX(100px)';
}, 16);

// ✅ Good: requestAnimationFrame
function animate() {
  element.style.transform = `translateX(${position}px)`;
  position += 1;
  if (position < 100) {
    requestAnimationFrame(animate);
  }
}
requestAnimationFrame(animate);

// ✅ Best: Web Animations API
element.animate([
  { transform: 'translateX(0)' },
  { transform: 'translateX(100px)' },
], {
  duration: 250,
  easing: 'ease-out',
  fill: 'forwards',
});
```

### When to use each

| API | Use Case | Frame Budget |
|-----|----------|-------------|
| `requestAnimationFrame` | Custom animation loops | 16ms (60fps) |
| `setTimeout(fn, 0)` | Defer non-visual work | N/A |
| `setInterval` | Never for animation | ❌ |
| Web Animations API | Declarative, CSS-like | Best (off-main-thread) |
| CSS `transition`/`animation` | Simple state changes | Best (off-main-thread) |
| `FLIP` technique | Layout animations | Good |

## FLIP Technique

```typescript
// FLIP: First, Last, Invert, Play
function flipAnimation(el: HTMLElement) {
  // First: record current position
  const first = el.getBoundingClientRect();

  // Apply change (e.g., append to different parent)
  list.appendChild(el);

  // Last: record new position
  const last = el.getBoundingClientRect();

  // Invert: calculate delta and apply
  const dx = first.left - last.left;
  const dy = first.top - last.top;
  el.style.transform = `translate(${dx}px, ${dy}px)`;

  // Play: animate to final (0,0)
  requestAnimationFrame(() => {
    el.style.transition = 'transform 250ms ease';
    el.style.transform = '';
  });
}
```

## Cleanup & Memory

```typescript
// composables/useAnimation.ts
export function useAnimation() {
  let rafId: number | null = null
  let observer: IntersectionObserver | null = null

  function startLoop(callback: () => void) {
    function loop() {
      callback()
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
  }

  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  function observeScroll(el: HTMLElement, onVisible: () => void) {
    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onVisible()
    })
    observer.observe(el)
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stopLoop()
    observer?.disconnect()
    // Clean up any manually added inline styles
  })

  return { startLoop, stopLoop, observeScroll }
}
```

```vue
<script setup lang="ts">
// Always cleanup event listeners
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Cleanup CSS animations/transitions added inline
function cleanupInlineStyles(el: HTMLElement) {
  el.style.transform = ''
  el.style.opacity = ''
  el.style.willChange = ''
}
</script>
```

## Frame Budget

```
Frame budget: 16.67ms (60fps)
├── JavaScript:     < 5ms
├── Style/Layout:   < 3ms
├── Paint:          < 3ms
├── Composite:      < 2ms
└── Buffer:         ~3.67ms
```

### Performance Budget in Code

```typescript
function measureFrameBudget() {
  let lastTime = performance.now()
  let frames = 0
  let dropped = 0

  function check() {
    frames++
    const now = performance.now()
    const delta = now - lastTime

    if (delta > 20) dropped++ // > 50fps? dropped frame

    lastTime = now

    if (frames < 60) {
      requestAnimationFrame(check)
    } else {
      console.log(`Frames: ${frames}, Dropped: ${dropped}, Budget: ${100 - (dropped / frames) * 100}%`)
    }
  }

  requestAnimationFrame(check)
}
```

## Profiling Checklist

- [ ] Animations run at 60fps (check Chrome DevTools Performance tab)
- [ ] No layout thrashing (read/write batching)
- [ ] Only `transform` and `opacity` animated
- [ ] `will-change` set before animation, removed after
- [ ] No `setTimeout`/`setInterval` for animation loops
- [ ] Event listeners cleaned up on unmount
- [ ] RAF callbacks cleaned up
- [ ] IntersectionObservers disconnected
- [ ] `prefers-reduced-motion: reduce` respected
- [ ] Mobile devices tested (lower GPU)

## DevTools Tips

```
Chrome DevTools → Performance:
  - Record animation
  - Check FPS counter (Rendering → FPS Meter)
  - Look for "Layout" and "Paint" events in timeline
  - Enable "Paint flashing" to see painted areas

Chrome DevTools → Rendering:
  - Layer borders (show composite layers)
  - FPS meter
  - Scrolling performance issues
```

## Summary

| Best Practice | Why |
|---------------|-----|
| Animate `transform` + `opacity` only | GPU composited, no layout/paint |
| Use `requestAnimationFrame` | Syncs with vsync |
| Avoid layout thrashing | Batch read/write operations |
| Use `will-change` sparingly | Set before animation, remove after |
| Prefer CSS transitions/animations | Off-main-thread compositing |
| Cleanup on unmount | Prevent memory leaks |
| Respect `prefers-reduced-motion` | User accessibility |
| Measure frame budget | Validate performance |
