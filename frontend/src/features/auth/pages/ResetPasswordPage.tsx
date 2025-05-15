// EASY-TRACABILITY:frontend/src/features/auth/pages/ResetPasswordPage.tsx

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import PasswordField from "../components/PasswordField";
import { resetPassword } from "../services/auth.service";
import NotificationBar from "../../../components/ui/NotificationBar";
import "../styles/AuthLayout.css";

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({
        text: "Les mots de passe ne correspondent pas.",
        type: "error",
      });
      return;
    }
    try {
      await resetPassword({ token: token!, newPassword });
      setMessage({
        text: "Mot de passe réinitialisé avec succès.",
        type: "success",
      });
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch {
      setMessage({
        text: "Échec de la réinitialisation. Veuillez réessayer.",
        type: "error",
      });
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      content="Create a new password. Ensure it differs from previous ones for security."
      className="auth-title forgot-password"
      showBackButton={true}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="form-group">
          <PasswordField
            value={newPassword}
            onChange={setNewPassword}
            placeholder="New password"
          />
        </div>

        <div className="form-group" style={{ marginTop: 16 }}>
          <PasswordField
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Confirm password"
          />
        </div>

        {message && (
          <div style={{ margin: "16px 0" }}>
            <NotificationBar message={message.text} type={message.type} />
          </div>
        )}

        <div className="form-actions">
          <button className="btn-primary" type="submit">
            UPDATE PASSWORD
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
