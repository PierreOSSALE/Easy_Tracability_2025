// EASY-TRACABILITY:frontend/src/features/auth/components/AuthLayout.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthLayout.css";

import topLeft from "../../../assets/img/figure/Figure_top_left.png";
import topRight from "../../../assets/img/figure/Figure_top_right.png";
import bottomLeft from "../../../assets/img/figure/Figure_bottom_left.png";
import bottomRight from "../../../assets/img/figure/Figure_bottom_right.png";
import logoEasy from "../../../../public/logo-easy-tracability.png";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  content?: string;
  className?: string;
  showBackButton?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title = "USER LOGIN",
  content,
  className = "auth-title",
  showBackButton = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className="auth-layout">
      {/* Decorative corners */}
      <img src={topLeft} alt="top-left" className="decor-top-left decor" />
      <img src={topRight} alt="top-right" className="decor-top-right decor" />
      <img
        src={bottomLeft}
        alt="bottom-left"
        className="decor-bottom-left decor"
      />
      <img
        src={bottomRight}
        alt="bottom-right"
        className="decor-bottom-right decor"
      />

      <div className="auth-container">
        {/* Logo en haut à gauche */}
        <img
          src="../../../../public/logo2.png"
          alt="logo"
          className="auth-logo"
        />

        {/* Back button */}
        {showBackButton && (
          <button className="back-button" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        )}

        {/* Titre au centre */}
        <h1 className={className}>{title}</h1>
        <p className="auth-content">{content}</p>
        {children}
      </div>

      {/* Logo en bas à gauche */}
      <img
        src={logoEasy}
        alt="Easy Tracability Logo"
        className="logo-bottom-left"
      />
    </div>
  );
};

export default AuthLayout;
