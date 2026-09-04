/**
 * The perspective grid receding to a horizon, and travelling toward the
 * viewer. Server component — it is four divs and no state.
 *
 * All of the interesting decisions are in globals.css (`.floor`), and two of
 * them are worth repeating here because they are easy to "simplify" back into
 * bugs:
 *
 *   - The travel is a `transform: translateY()` of exactly one grid cell, not
 *     an animated `background-position`. background-position is a paint
 *     property: animating it repaints this very large, rotated element every
 *     frame. The transform is composited, and one cell of travel makes the
 *     loop seamless.
 *   - The horizon falloff is a sibling overlay, not a `mask-image` on the
 *     animated plane. Masking a compositing layer makes WebKit re-rasterize
 *     it far more eagerly than it otherwise would.
 */
export default function GridFloor() {
  return (
    <div className="floor" aria-hidden="true">
      <div className="floor__plane" />
      <div className="floor__fade" />
    </div>
  );
}
