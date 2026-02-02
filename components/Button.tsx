import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  to?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  to, 
  onClick, 
  className = '', 
  type = 'button',
  fullWidth = false,
  disabled = false
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-md transition-all duration-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold";
  
  const variants = {
    primary: "border-transparent text-white bg-brand-blue hover:bg-blue-800 shadow-lg hover:shadow-xl hover:-translate-y-[1px]",
    secondary: "border-transparent text-white bg-brand-gold hover:brightness-90 shadow-md hover:-translate-y-[1px]",
    outline: "border-brand-blue text-brand-blue bg-transparent hover:bg-brand-blue/20",
    white: "border-transparent text-white bg-brand-gold hover:brightness-95 shadow-md hover:-translate-y-[1px]"
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : '';
  const combinedClasses = `${baseStyles} ${variants[variant]} ${widthClass} ${disabledClass} ${className}`;

  if (to) {
    if (disabled) {
      return <span className={combinedClasses}>{children}</span>;
    }
    return (
      <Link to={to} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClasses} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
