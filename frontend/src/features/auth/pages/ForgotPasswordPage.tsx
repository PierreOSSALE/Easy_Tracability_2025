// EASY-TRACABILITY:frontend/src/features/auth/pages/ForgotPasswordPage.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import TextBox from "devextreme-react/text-box";
import Validator, { RequiredRule, EmailRule } from "devextreme-react/validator";
import { requestResetPassword } from "../services/auth.service";
import NotificationBar from "../../../components/ui/NotificationBar";
import "../styles/AuthLayout.css";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    setMessage(null);
  }, []);

  const handleSubmit = async () => {
    try {
      const { resetToken } = await requestResetPassword(email);
      setMessage({ text: "Redirection en cours…", type: "success" });
      navigate(`/reset-password/${resetToken}`, { replace: true });
    } catch {
      setMessage({
        text: "Erreur lors de l'envoi du lien. Veuillez réessayer.",
        type: "error",
      });
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      content="Please enter your username to reset the password"
      className="auth-title forgot-password"
      showBackButton={true}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="form-group with-icon">
          <i className="icon fa-solid fa-envelope"></i>
          <TextBox
            value={email}
            onValueChanged={(e) => setEmail(e.value)}
            placeholder="Votre adresse e-mail"
            className="dx-texteditor-input"
          >
            <Validator>
              <RequiredRule message="Champ requis" />
              <EmailRule message="Adresse e-mail invalide" />
            </Validator>
          </TextBox>
        </div>

        {message && (
          <div style={{ margin: "16px 0" }}>
            <NotificationBar message={message.text} type={message.type} />
          </div>
        )}

        <div className="form-actions">
          <button className="btn-primary-auth" type="submit">
            SEND RESET LINK
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
