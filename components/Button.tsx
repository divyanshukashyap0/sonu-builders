import React from 'react';
import { Link } from 'react-router-dom';
import Magnetic from './luxury/Magnetic';

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
  const baseStyles = "inline-flex items-center justify-center px-10 py-6 text-base md:text-sm font-bold uppercase tracking-[0.2em] transition-all duration-500 rounded-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-theme-accent text-theme-background shadow-lg hover:shadow-[0_0_30px_rgba(var(--theme-accent-rgb),0.3)] hover:scale-[1.02] active:scale-95 border border-theme-accent",
    secondary: "bg-transparent border-2 border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-theme-background shadow-none hover:scale-[1.02] active:scale-95",
    white: "bg-transparent border-2 border-theme-text text-theme-text hover:bg-theme-text/10 hover:border-theme-accent hover:scale-[1.02] active:scale-95",
    outline: "border-2 border-theme-border text-theme-text hover:bg-theme-accent hover:text-theme-background hover:border-theme-accent hover:scale-[1.02] active:scale-95",
    ghost: "bg-transparent text-theme-text hover:bg-theme-secondary/20 hover:scale-[1.02] active:scale-95"
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const combinedClasses = `${baseStyles} ${variants[variant]} ${widthClass} ${className}`;

  const renderContent = () => {
    if (to) {
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

  return <Magnetic>{renderContent()}</Magnetic>;
};

export default Button;
