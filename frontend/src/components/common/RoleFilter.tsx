// EASY-TRACABILITY:frontend/src/components/common/RoleFilter.tsx

import React from "react";
import SelectBox from "devextreme-react/select-box";
import { UserRole } from "../../features/admin/types/user";

interface Props {
  value: string;
  onChange: (role: string) => void;
}

export const RoleFilter: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div style={{ marginBottom: 15 }}>
      <label style={{ marginRight: 10 }}>Filtrer par rôle :</label>
      <SelectBox
        dataSource={["", ...Object.values(UserRole)]}
        value={value}
        placeholder="Tous"
        onValueChange={(val) => onChange(val)}
        width={200}
      />
    </div>
  );
};
