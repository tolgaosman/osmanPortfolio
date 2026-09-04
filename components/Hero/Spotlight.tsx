/**
 * The cursor light.
 *
 * `mix-blend-mode: screen` is what makes this cheap: the element holds a
 * STATIC radial gradient and only ever moves by transform, and the blend
 * brightens everything painted beneath it in the same stacking context — the
 * grid, the wall name, the code rain — for the price of one composited layer.
 * Moving the gradient's centre instead would repaint a viewport-sized layer
 * sixty times a second, because there is no compositor fast path for that.
 *
 * `data-spot` is the hook `usePointerVars` looks for; it writes --sx/--sy
 * directly onto this element rather than onto an ancestor, because those
 * properties are registered `inherits: false`.
 *
 * The blending is confined by the hero's own `isolation: isolate`, so the
 * light never reaches the sections below. It is hidden outright on touch
 * devices and under reduced motion (globals.css) — there is no cursor to
 * follow, and a light stuck in one corner reads as a rendering bug.
 */
export default function Spotlight() {
  return <div className="spot" data-spot aria-hidden="true" />;
}
