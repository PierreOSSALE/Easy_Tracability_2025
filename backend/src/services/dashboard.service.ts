// EASY-TRACABILITY: backend/src/services/dashboard.service.ts
import { DataWarehouseService } from "./dataWarehouse.service";
import { format } from "date-fns";
import { Op } from "sequelize";
import { ProductModel } from "../models/product";

export class DashboardService {
  private dw = new DataWarehouseService();

  /**
   * Tendances d'inventaire journalier entre deux dates
   */
  async getInventoryTrend(startDate: Date, endDate: Date): Promise<any[]> {
    // Formater en YYYY-MM-DD
    const start = format(startDate, "yyyy-MM-dd");
    const end = format(endDate, "yyyy-MM-dd");

    // Récupère les faits filtrés par période
    const facts = await this.dw.queryFacts({ startDate: start, endDate: end });

    // Agréger quantité par date issue de la dimension temps
    const trend: Record<string, number> = {};
    for (const f of facts) {
      const dateKey = (f.timeDim.date as Date).toISOString().slice(0, 10);
      trend[dateKey] = (trend[dateKey] || 0) + f.quantity;
    }

    return Object.entries(trend)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, value]) => ({ label, value }));
  }

  /**
   * Chiffre d'affaires par produit
   */
  async getSalesByProduct(): Promise<any[]> {
    // On récupère tous les faits (sans filtre)
    const facts = await this.dw.queryFacts({});

    // Somme du totalPrice par nom de produit (dimProduct)
    const sales: Record<string, number> = {};
    for (const f of facts) {
      const prod = f.productDim;
      if (!prod) continue;
      sales[prod.uuid] = (sales[prod.uuid] || 0) + Number(f.totalPrice);
    }

    return Object.entries(sales).map(([label, value]) => ({ label, value }));
  }

  /**
   * Alertes sur le stock courant en dessous d'un seuil
   */
  async getAlerts(threshold: number): Promise<any[]> {
    // On interroge directement le modèle Produit
    const prods = await ProductModel.findAll({
      where: { stockQuantity: { [Op.lte]: threshold } },
    });

    return prods.map((p) => ({
      productBarcode: p.barcode,
      quantity: p.stockQuantity,
      threshold,
    }));
  }
}
