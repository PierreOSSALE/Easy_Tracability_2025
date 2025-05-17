// EASY-TRACABILITY:frontend/src/components/common/SelectField.tsx

import "./styles/InputField.css";

interface SelectFieldProps<T extends string | number> {
  value: T;
  onChange: (value: T) => void;
  options: T[];
  label?: string;
  placeholder?: string;
}

const SelectField = <T extends string | number>({
  value,
  onChange,
  options,
  label,
  placeholder,
}: SelectFieldProps<T>) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="form-select"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {String(opt)}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField;
