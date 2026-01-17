export const primaryBtnVariant = {
  // Use project beige colors so inline styles from framer-motion don't override Tailwind classes
  initial: { scale: 1, background: "#a68b6a" }, // primaryColor
  click: { scale: 0.99, background: "#8b7355" }, // darkPrimaryColor
  transition: { duration: 0.3, ease: "ease-in-out" },
};

export const ScaleOnClickVariant = {
  initial: { scale: 1 },
  click: { scale: 0.99 },
  transition: { duration: 0.2, ease: "ease-in-out" },
};

export const cartTextChangeVariant = {
  initial: { opacity: 1 },
  animate: { opacity: 0 },
  transition: { duration: 0.3, ease: "ease-in-out" },
};
