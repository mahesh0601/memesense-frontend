export function IconButton({ icon, label, className = "", type = "button", ...props }) {
  return (
    <button
      className={`icon-button ${className}`.trim()}
      type={type}
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
    </button>
  );
}
