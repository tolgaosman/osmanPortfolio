# Emil Kowalski / Motion & Micro-interaction Engineering

- **Organic Motion**: Every state change, modal open, page transition, and layout shift MUST be animated organically.
- **No Linear Transitions**: Never use `ease-linear`. Default to custom springs (`type: "spring", stiffness: 400, damping: 30`) or precise cubic-bezier curves (e.g., `ease: [0.22, 1, 0.36, 1]`).
- **Tactile Feedback**: Interactive elements (buttons, cards) must have hover (e.g., `scale: 1.02`) and tap (e.g., `scale: 0.97`) states.
- **Layout Animations**: When elements are added, removed, or change size, use `layout` in Framer Motion to smoothly transition siblings.
- **Staggered Entrances**: Lists and grids should never appear all at once. Use staggered delays (e.g., `transition: { staggerChildren: 0.05 }`).
- **Exit Animations**: Always use `AnimatePresence` for unmounting components so they fade/scale out gracefully. 
- **Performance**: Animate only compositing properties (`transform`, `opacity`) to maintain 60-120 fps. Never animate `width`, `height`, or `margin` directly unless using Framer Motion's `layout` prop.
