// EASY-TRACABILITY: frontend/src/features/manager/components/ManagerDashboardPage.tsx

import React from "react";
import { BaseProductsPage } from "../../../components/common/BaseProductsPage";

const ManagerProductsPage: React.FC = () => {
  // On interdit la suppression pour les managers
  return <BaseProductsPage title="Produits (Manager)" canDelete={false} />;
};

export default ManagerProductsPage;
