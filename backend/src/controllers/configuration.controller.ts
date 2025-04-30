//EASY-TRACABILITY: backend/src/controllers/configuration.controller.ts

import { Request, Response } from "express";
import { ConfigurationService } from "../services/configuration.service";

export const getAllConfigurations = async (_req: Request, res: Response) => {
  const configs = await ConfigurationService.getAll();
  res.json(configs);
};

export const updateConfiguration = async (req: Request, res: Response) => {
  const { name } = req.params;
  const { parameterValue, userUUID } = req.body;

  const updated = await ConfigurationService.update(name, {
    parameterValue,
    lastModifiedBy: userUUID,
  });

  res.json(updated);
};

export const createConfiguration = async (req: Request, res: Response) => {
  const config = await ConfigurationService.create(req.body);
  res.status(201).json(config);
};
