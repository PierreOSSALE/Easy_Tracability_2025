// EASY-TRACABILITY:frontend/src/features/auth/components/PasswordField.tsx

import React, { useState } from "react";
import TextBox from "devextreme-react/text-box";

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  value,
  onChange,
  placeholder = "Password",
}) => {
  // Ajout d'un état pour gérer la visibilité du mot de passe
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => setVisible(!visible);

  return (
    <div className="password-wrapper with-icon">
      {/* Icône de cadenas dans le champ */}
      <i className="icon fas fa-lock"></i>

      <TextBox
        // Change le mode selon si le mot de passe est visible ou non
        mode={visible ? "text" : "password"}
        value={value}
        onValueChanged={(e) => onChange(e.value)}
        placeholder={placeholder}
        className="dx-texteditor-input"

        // showClearButton
      ></TextBox>

      {/* Icône pour afficher/masquer le mot de passe */}
      <i
        className={`toggle-visibility fas ${visible ? "fa-eye" : "fa-eye-slash"}`}
        onClick={toggleVisibility}
      ></i>
    </div>
  );
};

export default PasswordField;
