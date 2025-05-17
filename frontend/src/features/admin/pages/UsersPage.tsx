// EASY-TRACABILITY:frontend/src/features/admin/pages/UsersPage.tsx

import { useUsers } from "../hooks/useUsers";
import { User, UserRole } from "../types/user";
import {
  Column,
  FilterConfig,
  GenericEntityPage,
} from "../../../components/common/GenericEntityPage";
import InputField from "../../../components/common/InputField";
import SelectField from "../../../components/common/SelectField";

export default function UsersPage() {
  const { users, loading, error, addUser, modifyUser, removeUser } = useUsers();

  const userColumns: Column<User>[] = [
    { header: "UUID", accessor: "uuid" },
    { header: "Nom d’utilisateur", accessor: "username" },
    { header: "Email", accessor: "email" },
    {
      header: "Rôle",
      accessor: "role",
      render: (u) => u.role,
    },
  ];

  const userFilters: FilterConfig<User>[] = [
    {
      key: "role",
      placeholder: "Filtrer par rôle",
      filterFn: (u, v) => (v ? u.role === v : true),
    },
    {
      key: "username",
      placeholder: "Filtrer par nom",
      filterFn: (u, v) => u.username.toLowerCase().includes(v.toLowerCase()),
    },
    {
      key: "uuid",
      placeholder: "Filtrer par UUID",
      filterFn: (u, v) => u.uuid.includes(v),
    },
  ];

  return (
    <div style={{ paddingTop: 20 }}>
      <h4>Utilisateurs</h4>
      <GenericEntityPage<User>
        title="Utilisateurs"
        items={users}
        loading={loading}
        error={error}
        addItem={addUser}
        updateItem={(id, data) => modifyUser(id, data)}
        deleteItem={removeUser}
        itemKey="uuid"
        columns={userColumns}
        defaultNewItemState={{
          username: "",
          email: "",
          role: UserRole.ADMIN,
          hashedPassword: "",
        }}
        renderAddForm={(state, setState) => (
          <>
            <InputField
              icon="fa fa-user"
              value={state.username}
              onChange={(value) => setState({ ...state, username: value })}
              placeholder="Nom utilisateur"
            />
            <InputField
              icon="fa fa-envelope"
              value={state.email}
              onChange={(value) => setState({ ...state, email: value })}
              placeholder="Email"
              type="email"
            />

            <InputField
              icon="fa fa-lock"
              value={state.hashedPassword}
              onChange={(value) =>
                setState({ ...state, hashedPassword: value })
              }
              placeholder="Mot de passe"
              type="password"
            />

            <SelectField<UserRole>
              value={state.role}
              onChange={(value) => setState({ ...state, role: value })}
              options={Object.values(UserRole)}
            />
          </>
        )}
        filterConfigs={userFilters}
        pageSizeOptions={[5, 10, 20, 50]}
      />
    </div>
  );
}
