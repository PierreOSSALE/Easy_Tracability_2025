// EASY-TRACABILITY:frontend/src/hooks/useConfiguration.ts

import { useEffect, useState, useCallback } from "react";
import * as configurationService from "../services/configuration.service";
import { Configuration } from "../types/configuration";

export const useConfigurations = () => {
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadConfigurations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await configurationService.fetchAllConfigurations();
      setConfigurations(data);
    } catch (err: unknown) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfigurations();
  }, [loadConfigurations]);

  const addConfiguration = useCallback(
    async (
      config: Omit<Configuration, "uuid" | "lastModifiedAt" | "lastModifiedBy">
    ) => {
      const created = await configurationService.createConfiguration(config);
      setConfigurations((prev) => [...prev, created]);
    },
    []
  );

  const modifyConfiguration = useCallback(
    async (
      parameterKey: string,
      updates: Partial<
        Omit<
          Configuration,
          "uuid" | "parameterKey" | "lastModifiedAt" | "lastModifiedBy"
        >
      >
    ) => {
      const updated = await configurationService.updateConfiguration(
        parameterKey,
        updates
      );
      setConfigurations((prev) =>
        prev.map((conf) =>
          conf.parameterKey === parameterKey ? updated : conf
        )
      );
    },
    []
  );

  const getConfigurationValue = useCallback(
    (key: string): string | undefined =>
      configurations.find((c) => c.parameterKey === key)?.parameterValue,
    [configurations]
  );

  return {
    configurations,
    loading,
    error,
    loadConfigurations,
    addConfiguration,
    modifyConfiguration,
    getConfigurationValue,
  };
};
