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
  const baseStyles = "inline-flex items-center justify-center px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] transition-all duration-500 rounded-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-luxury-gold text-white hover:bg-luxury-charcoal shadow-luxury hover:shadow-luxury-hover",
    secondary: "bg-luxury-charcoal text-white hover:bg-luxury-gold shadow-luxury",
    outline: "border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white",
    white: "bg-white dark:bg-luxury-obsidian text-luxury-charcoal dark:text-white border border-luxury-gold/20 dark:border-luxury-gold/50 hover:border-luxury-gold shadow-luxury hover:shadow-luxury-hover"
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
