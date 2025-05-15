// EASY-TRACABILITY:frontend/src/hooks/useUsers.ts
import { useEffect, useState, useCallback } from "react";
import * as userService from "../services/user.service";
import { User } from "../types/user";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const getAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.fetchUsers();
      setUsers(data);
    } catch (err: unknown) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const getUserById = useCallback(
    async (uuid: string): Promise<User | null> => {
      try {
        return await userService.fetchUserById(uuid);
      } catch (err: unknown) {
        setError(err as Error);
        return null;
      }
    },
    []
  );

  const addUser = useCallback(async (user: Omit<User, "uuid">) => {
    const newUser = await userService.createUser(user);
    setUsers((prev) => [...prev, newUser]);
  }, []);

  const removeUser = useCallback(async (uuid: string) => {
    await userService.deleteUser(uuid);
    setUsers((prev) => prev.filter((user) => user.uuid !== uuid));
  }, []);

  const modifyUser = useCallback(
    async (uuid: string, updates: Partial<Omit<User, "uuid">>) => {
      const updated = await userService.updateUser(uuid, updates);
      setUsers((prev) =>
        prev.map((user) => (user.uuid === uuid ? updated : user))
      );
    },
    []
  );

  const findUsersByUsername = useCallback(async (username: string) => {
    const found = await userService.searchUsersByUsername(username);
    setUsers(found);
  }, []);

  const filterUsersByRole = useCallback(async (role: string) => {
    const found = await userService.getUsersByRole(role);
    setUsers(found);
  }, []);

  return {
    users,
    loading,
    error,
    addUser,
    removeUser,
    modifyUser,
    findUsersByUsername,
    filterUsersByRole,
    getUserById,
    refreshUsers: getAllUsers,
  };
};
