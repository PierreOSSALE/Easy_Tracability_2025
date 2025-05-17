// EASY-TRACABILITY:frontend/src/features/auth/pages/LoginPage.tsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import PasswordField from "../components/PasswordField";
import TextBox from "devextreme-react/text-box";
import { useAuthContext } from "../hooks/useAuthContext";
import NotificationBar from "../../../components/ui/NotificationBar";
import { LoginPayload } from "../types/auth";
import "../styles/AuthLayout.css"; // ← import du CSS

const rolePaths: Record<string, string> = {
  Admin: "admin",
  Operator: "operator",
  Manager: "manager",
};

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const { login, loading } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const user = await login({
        username,
        password,
        mode: "jwt",
      } as LoginPayload);
      const base = rolePaths[user.role] || "";
      navigate(`/${base}`, { replace: true });
    } catch {
      setMessage({
        text: "Vérifiez vos identifiants.",
        type: "error",
      });
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Champ de l'utilisateur avec icône */}
        <div className="form-group with-icon">
          <i className="icon fas fa-user"></i>
          <TextBox
            value={username}
            onValueChanged={(e) => setUsername(e.value)}
            placeholder="User Name"
            className="dx-texteditor-input"
            // showClearButton
          ></TextBox>
        </div>

        {/* Champ du mot de passe */}
        <div className="form-group">
          <PasswordField
            value={password}
            onChange={setPassword}
            placeholder="Password"
          />
        </div>

        {message && (
          <NotificationBar message={message.text} type={message.type} />
        )}

        <div className="form-actions">
          <button className="btn-primary-auth" type="submit" disabled={loading}>
            LOGIN
          </button>
        </div>
      </form>

      <div className="forgot-link">
        <Link to="/forgot-password">Forgot password ?</Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
