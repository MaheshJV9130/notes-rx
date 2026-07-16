import React from 'react'

const Button = ({ children, variant = "secondary", onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg m-2 cursor-pointer ${
        variant === "primary"
          ? "text-white bg-blue-500 hover:bg-blue-500/70"
          : "bg-blue-100 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

export default Button
