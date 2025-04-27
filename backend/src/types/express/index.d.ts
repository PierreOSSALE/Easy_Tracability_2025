// EASY-TRACABILITY:backend/src/types/express/index.d.ts
import { UserSessionDTO } from "../../dto/user-session.dto";

declare module "express-session" {
  interface SessionData {
    user?: UserSessionDTO;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: UserSessionDTO;
    }
  }
}
