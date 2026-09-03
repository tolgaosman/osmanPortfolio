# Impeccable Engineering

- **Edge Cases First**: Assume the worst. What if the network fails? What if the array is empty? What if the user double-clicks? Handle all of this proactively.
- **Absolute Type Safety**: Strict TypeScript. No `any`, no `@ts-ignore`. Exhaustive union checks. Define exact interfaces.
- **Flawless Loading States**: Use Skeleton loaders that perfectly match the dimensions of the incoming content. No layout shift when data arrives.
- **Graceful Error Handling**: Fallbacks for failed images, Error Boundaries for failed components, toast notifications for failed API mutations.
- **Accessibility (a11y)**: Semantic HTML (`<nav>`, `<main>`, `<dialog>`), proper `aria-labels` for icon buttons, `focus-visible` styles for keyboard navigation, adequate color contrast.
- **State Integrity**: Keep React state minimal. Derive values during render instead of storing them. Avoid `useEffect` for data synchronization if possible.
- **Zero Layout Shift (CLS)**: Pre-allocate space for dynamic content. Images must have `width` and `height`.
