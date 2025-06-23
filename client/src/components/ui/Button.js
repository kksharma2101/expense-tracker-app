const Button = ({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  onClick,
}) => {
  // Determine variant-specific styles
  const variantStyles = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost:
      "bg-transparent text-indigo-600 hover:bg-gray-100 focus:ring-indigo-500",
  };

  // Determine size-specific styles
  const sizeStyles = {
    small: "px-3 py-1 text-sm",
    medium: "px-3 py-1 text-base",
    large: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      className={` ${variantStyles[variant]} ${className} ${sizeStyles[size]} rounded-md`}
    >
      {children}
    </button>
  );
};

export default Button;
