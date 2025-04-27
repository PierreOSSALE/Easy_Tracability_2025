// EASY-TRACABILITY: backend/src/utils/catchAsync.utils.ts

import { Request, Response, NextFunction } from "express";

function catchAsync(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): (req: Request, res: Response, next: NextFunction) => void {
  return function (req: Request, res: Response, next: NextFunction): void {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export { catchAsync };
