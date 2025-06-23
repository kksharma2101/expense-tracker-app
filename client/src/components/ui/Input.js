const Input = ({
  id,
  label,
  type = "text", // Default type is 'text'
  placeholder = "",
  value,
  onChange,
  className = "", // Additional classes for customization
  ...props // Allows passing other native input attributes
}) => {
  return (
    <div className="mb-4">
      {/* Label for the input field, linked by 'htmlFor' to the input's 'id' */}
      {label && (
        <label
          htmlFor={id}
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          {label}
        </label>
      )}
      {/* The input element itself */}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${className}`}
        {...props} // Spread any additional props here
      />
    </div>
  );
};

export default Input;
