// EASY-TRACABILITY: backend/src/services/configuration.service.ts

import { ConfigurationModel } from "../models/configuration";
import { IConfigurationUpdate } from "../interfaces/configuration.interface";

export class ConfigurationService {
  static async getAll() {
    return await ConfigurationModel.findAll();
  }

  static async getByKey(key: string) {
    return await ConfigurationModel.findOne({ where: { parameterKey: key } });
  }

  static async update(key: string, data: IConfigurationUpdate) {
    const config = await ConfigurationModel.findOne({
      where: { parameterKey: key },
    });

    if (!config) throw new Error("Paramètre non trouvé");

    await config.update({
      parameterValue: data.parameterValue,
      lastModifiedBy: data.lastModifiedBy,
      lastModifiedAt: new Date(),
    });

    return config;
  }

  static async createDefault(adminId: string) {
    const defaults = [
      { parameterKey: "critical_stock_threshold", parameterValue: "5" },
      { parameterKey: "enable_notifications", parameterValue: "true" },
      { parameterKey: "report_frequency", parameterValue: "weekly" },
    ];

    for (const param of defaults) {
      await ConfigurationModel.findOrCreate({
        where: { parameterKey: param.parameterKey },
        defaults: {
          parameterValue: param.parameterValue,
          lastModifiedBy: adminId,
          lastModifiedAt: new Date(),
        },
      });
    }
  }

  static async create(data: {
    parameterKey: string;
    parameterValue: string;
    userUUID?: string;
  }) {
    return await ConfigurationModel.create({
      ...data,
      lastModifiedBy: data.userUUID,
      lastModifiedAt: new Date(),
    });
  }
}
