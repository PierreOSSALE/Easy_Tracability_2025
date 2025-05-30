//EASY-TRACABILITY: backend//src/interface/collector.interface.ts

import { OperationType } from "./MovementLineModel.interface";

export interface IDataCollectorDTO {
  ticketId: string; // identifiant de la commande / bon de mouvement
  userUUID: string; // UUID de l’utilisateur scannant
  timestamp: Date; // date/heure du scan
  lines: Array<{
    productBarcode: string; // code-barres scanné
    operationType: OperationType; // ENTREE | SORTIE
    quantity: number;
  }>;
}
