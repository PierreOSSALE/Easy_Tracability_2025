// EASY-TRACABILITY:frontend/src/components/common/InputField.tsx
import React, { useState } from "react";
import TextBox from "devextreme-react/text-box";
import type { TextBoxType } from "devextreme/ui/text_box";
import "./styles/InputField.css";

interface InputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  type?: TextBoxType;
  icon?: string;
  className?: string; // ✅ nouvelle prop optionnelle
}

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  placeholder = "",
  type = "text",
  label,
  icon,
  className = "", // valeur par défaut
}) => {
  const [show, setShow] = useState(type !== "password");
  const effectiveType: TextBoxType =
    type === "password" && !show ? "password" : "text";

  const toggleShow = () => setShow((prev) => !prev);

  const rootClass = [
    "form-group",
    icon || type === "password" ? "with-icon" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      {label && <label className="form-label">{label}</label>}

      {icon && <i className={`icon ${icon}`} />}

      <TextBox
        mode={effectiveType}
        value={value}
        onValueChanged={(e) => onChange(e.value)}
        placeholder={placeholder}
        className="dx-texteditor-input"
        showClearButton
      />

      {type === "password" && (
        <i
          className={`toggle-visibility fa ${show ? "fa-eye" : "fa-eye-slash"}`}
          onClick={toggleShow}
        />
      )}
    </div>
  );
};

export default InputField;
