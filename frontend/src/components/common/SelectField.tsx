// EASY-TRACABILITY:frontend/src/components/common/SelectField.tsx

import "./styles/InputField.css";

interface SelectFieldProps<T extends string | number> {
  value: T;
  onChange: (value: T) => void;
  options: T[];
  label?: string;
  placeholder?: string;
  className?: string;
  name?: string;
  icon?: string; // nom de la classe pour votre icône, par exemple "fa fa-chevron-down"
}

const SelectField = <T extends string | number>({
  value,
  onChange,
  options,
  label,
  placeholder,
  className,
  name,
  icon,
}: SelectFieldProps<T>) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}
    <div
      className="select-wrapper"
      style={{ position: "relative", display: "inline-block" }}
    >
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={`form-select ${className ? className : ""}`}
        style={{ paddingRight: icon ? "2rem" : undefined }} // ajustez le padding pour faire de la place pour l'icône
      >
        {icon && (
          <i
            className={icon}
            style={{
              background: "#000",
              position: "absolute",
              top: "50%",
              right: "0.5rem",
              transform: "translateY(-50%)",
              pointerEvents: "none", // afin que l'icône n'empêche pas l'interaction avec le select
            }}
          />
        )}
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {String(opt)}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default SelectField;
