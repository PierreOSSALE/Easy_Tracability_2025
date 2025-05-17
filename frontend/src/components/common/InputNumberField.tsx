// EASY-TRACABILITY:frontend/src/components/common/InputNumberField.tsx

import React from "react";
import NumberBox from "devextreme-react/number-box";
import "./styles/InputField.css";

interface InputNumberFieldProps {
  value?: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  step?: number;
  /** Icône Font‑Awesome, ex. "fa fa-boxes" */
  icon?: string;
}

const InputNumberField: React.FC<InputNumberFieldProps> = ({
  value,
  onChange,
  placeholder = "",
  min = 0,
  step = 1,
  icon = "fa fa-hashtag",
}) => (
  <div className="form-group with-icon">
    <i className={`icon ${icon}`} />
    <NumberBox
      value={value ?? undefined}
      min={min}
      step={step}
      onValueChanged={(e) => onChange(e.value)}
      placeholder={placeholder}
      showSpinButtons
      className="dx-numberbox-input"
    />
  </div>
);

export default InputNumberField;
