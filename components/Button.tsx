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
    primary: "bg-gradient-to-r from-luxury-gold to-[#8E6D45] text-white shadow-lg hover:shadow-glow-gold hover:scale-105 active:scale-95 border border-transparent",
    secondary: "bg-transparent border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white shadow-none hover:shadow-glow-gold hover:scale-105 active:scale-95",
    white: "bg-transparent border-2 border-white text-white hover:bg-white/10 hover:border-luxury-gold hover:text-white shadow-none hover:shadow-glow-green hover:scale-105 active:scale-95",
    outline: "border-2 border-luxury-charcoal text-luxury-charcoal dark:border-white dark:text-white hover:bg-luxury-charcoal hover:text-white dark:hover:bg-white dark:hover:text-luxury-charcoal hover:scale-105 active:scale-95",
    ghost: "bg-transparent text-luxury-charcoal dark:text-white hover:bg-black/5 dark:hover:bg-white/10 hover:scale-105 active:scale-95"
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
