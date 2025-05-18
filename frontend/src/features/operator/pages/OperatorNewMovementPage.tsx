// EASY-TRACABILITY: frontend/src/features/operateur/components/OperatorNewMovementPage.tsx

import React, { useState } from "react";
import { useProducts } from "../../../hooks/useProduct";
import { useInventoryMovements } from "../../../hooks/useInventoryMovement";
import InputNumberField from "../../../components/common/InputNumberField";
import { Button } from "devextreme-react/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "../../admin/styles/DashboardCharts.module.css";

import "../../../index.css";
import { OperationType } from "../../../types/inventoryMovement";

export const OperatorNewMovementPage: React.FC = () => {
  const { products } = useProducts();
  const { addMovement } = useInventoryMovements();
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [operationType, setOperationType] = useState<OperationType>(
    OperationType.ENTREE
  );
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [error, setError] = useState<string | null>(null);
  const ticketRef = React.useRef<HTMLDivElement>(null);

  const handleLookup = () => {
    const found = products.find((p) => p.barcode === barcode);
    if (!found) {
      setError("Produit non trouvé");
      setProduct(null);
    } else {
      setError(null);
      setProduct(found);
    }
  };

  const handleSubmit = async () => {
    if (!product) {
      setError("Veuillez sélectionner un produit valide");
      return;
    }
    try {
      const newMovement = await addMovement({
        barcode: product.barcode,
        date: new Date(date),
        operationType,
        quantity,
      });

      // génération ticket PDF pour un seul produit
      if (ticketRef.current) {
        const canvas = await html2canvas(ticketRef.current);
        const img = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(
          img,
          "PNG",
          10,
          10,
          190,
          (canvas.height * 190) / canvas.width
        );
        pdf.save(`ticket_${newMovement.uuid}.pdf`);
      }
      // remise à zéro
      setBarcode("");
      setProduct(null);
      setQuantity(1);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Erreur lors de la création du mouvement");
    }
  };

  return (
    <div className={styles.container}>
      <h4>Nouvel Mouvement</h4>
      <div className={styles.form}>
        <div className={styles.barcodeRow}>
          {" "}
          <input
            type="text"
            placeholder="Scannez ou saisissez le code-barres"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />{" "}
          <Button
            icon="search"
            onClick={handleLookup}
            stylingMode="contained"
          />
        </div>
        {product && (
          <div className={styles.productInfo}>
            <strong>{product.name}</strong> — Stock actuel :{" "}
            {product.stockQuantity}
          </div>
        )}
        <InputNumberField
          placeholder="Quantité"
          value={quantity}
          onChange={setQuantity}
          min={1}
          icon="fa fa-boxes"
        />
        <select
          value={operationType}
          onChange={(e) => setOperationType(e.target.value as OperationType)}
        >
          <option value={OperationType.ENTREE}>ENTRÉE</option>
          <option value={OperationType.SORTIE}>SORTIE</option>
        </select>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button
          text="Valider le mouvement"
          type="success"
          onClick={handleSubmit}
        />
        {error && <div className={styles.error}>{error}</div>}
      </div>

      {/* ticket à générer */}
      <div ref={ticketRef} className={styles.ticket}>
        <h5>Ticket de mouvement</h5>
        <p>Date/Heure : {new Date(date).toLocaleString()}</p>
        <table className={styles.ticketTable}>
          <thead>
            <tr>
              <th>Produit</th>
              <th>Qté</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {product && (
              <tr>
                <td>{product.name}</td>
                <td>{quantity}</td>
                <td>{operationType}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OperatorNewMovementPage;
