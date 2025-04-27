// EASY-TRACABILITY: backend/src/middlewares/authorizeRole.middleware.ts
export const authorizeRole = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ message: "Accès interdit" });
    }
    next();
  };
};
