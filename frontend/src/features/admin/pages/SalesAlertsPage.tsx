// EASY-TRACABILITY:frontend/src/features/admin/pages/SalesAlertsPage.tsx

import { useState, useEffect } from "react";
import { useDashboardData } from "../../../hooks/useDashboardData";
import DynamicTable from "../../../components/common/DynamicTable";
import {
  Chart,
  Series,
  ArgumentAxis,
  ValueAxis,
  Tooltip,
  Title,
} from "devextreme-react/chart";
import { queryDimension } from "../../../services/dataWarehouse.service";
import { DimProduct } from "../../../types/dimension";
import { IChartPoint } from "../../../types/dashboard";

export default function SalesAlertsPage() {
  const [threshold, setThreshold] = useState(0);
  const { sales, alerts, refresh } = useDashboardData();
  const [salesData, setSalesData] = useState<IChartPoint[]>(sales);

  // Enrichir les labels avec le nom produit
  useEffect(() => {
    async function enrich() {
      const enriched: IChartPoint[] = await Promise.all(
        sales.map(async (pt) => {
          try {
            // pt.label contient désormais l’UUID
            const prod = await queryDimension<DimProduct>("product", pt.label);
            return { label: prod.name || pt.label, value: pt.value };
          } catch {
            return pt;
          }
        })
      );
      setSalesData(enriched);
    }
    enrich();
  }, [sales]);

  return (
    <div style={{ padding: 20 }}>
      <h4>Ventes par produit & Alertes</h4>
      <Chart dataSource={salesData}>
        <Title text="Chiffre d’affaires par produit" />
        <ArgumentAxis />
        <ValueAxis />
        <Series valueField="value" argumentField="label" type="bar" name="CA" />
        <Tooltip enabled />
      </Chart>
      <hr />
      <input
        type="number"
        value={threshold}
        onChange={(e) => setThreshold(Number(e.target.value))}
        placeholder="Seuil quantité"
      />
      <button onClick={() => refresh.alerts(threshold)}>
        Actualiser Alertes
      </button>
      <DynamicTable
        data={alerts}
        columns={[
          { header: "Barcode", accessor: "productBarcode" },
          { header: "Quantité", accessor: "quantity" },
          { header: "Seuil", accessor: "threshold" },
        ]}
        rowKey="productBarcode"
      />
    </div>
  );
}
