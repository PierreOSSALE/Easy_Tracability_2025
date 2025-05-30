// EASY-TRACABILITY: frontend/src/features/operator/pages/OperatorNewMovementPage.tsx

import React, { useState, useRef } from "react";
import { useProducts } from "../../../hooks/useProduct";
import { createMovement } from "../../../services/InventoryMovement.service";
import { OperationType } from "../../../types/inventoryMovement";
import { Button } from "devextreme-react/button";
import { TextBox } from "devextreme-react/text-box";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../styles/NewMovementPage.css";

interface CartItem {
  barcode: string;
  name: string;
  quantity: number;
  price: number;
  operationType: OperationType;
  stockQuantity: number;
}

const OperatorNewMovementPage: React.FC = () => {
  const { products } = useProducts();

  const [productBarcode, setProductBarcode] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ticketId] = useState<string>(() => `TICKET-${Date.now()}`);
  const [operationType, setOperationType] = useState<OperationType>(
    OperationType.SORTIE
  ); // VENTE par défaut
  const ticketRef = useRef<HTMLDivElement>(null);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleLookup = () => {
    const match = productBarcode.match(/^(\d+)\s*([\+\-\*])\s*(\d+)$/);
    let barcode = productBarcode;
    let quantity = 1;
    let operation: "+" | "-" | "*" | null = null;

    if (match) {
      barcode = match[1];
      operation = match[2] as "+" | "-" | "*";
      quantity = parseInt(match[3], 10);
      if (isNaN(quantity) || quantity <= 0) {
        setError("Quantité invalide");
        return;
      }
    }

    const found = products.find((p) => p.barcode === barcode);
    if (!found) {
      setError("Produit non trouvé");
      return;
    }

    const stock = found.stockQuantity;

    setCart((prev) => {
      const exist = prev.find((i) => i.barcode === found.barcode);

      if (exist) {
        let newQty = exist.quantity;

        if (operation === "+") {
          newQty += quantity;
        } else if (operation === "*") {
          newQty *= quantity;
        } else if (operation === "-") {
          newQty -= quantity;
        } else {
          newQty += 1;
        }

        if (operationType === OperationType.SORTIE && newQty > stock) {
          setError(`Quantité en stock insuffisante (max ${stock})`);
          return prev;
        }

        if (newQty <= 0) {
          return prev.filter((i) => i.barcode !== barcode);
        }

        setError(null);
        return prev.map((i) =>
          i.barcode === barcode ? { ...i, quantity: newQty } : i
        );
      }

      if (operation === "-" || operation === "*") {
        setError("Produit non encore ajouté");
        return prev;
      }

      if (operationType === OperationType.SORTIE && stock < quantity) {
        setError(`Stock insuffisant pour ${quantity} unités`);
        return prev;
      }

      setError(null);
      return [
        ...prev,
        {
          barcode,
          name: found.name,
          quantity,
          price: found.price,
          operationType,
          stockQuantity: stock,
        },
      ];
    });

    setProductBarcode("");
  };

  const increaseQty = (barcode: string) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.barcode === barcode) {
          const newQty = i.quantity + 1;
          if (
            i.operationType === OperationType.SORTIE &&
            newQty > i.stockQuantity
          ) {
            setError(`Quantité en stock insuffisante (max ${i.stockQuantity})`);
            return i;
          }
          setError(null);
          return { ...i, quantity: newQty };
        }
        return i;
      })
    );
  };

  const handlePrint = async () => {
    if (!cart.length) {
      setError("Veuillez ajouter au moins un produit");
      return;
    }

    for (const item of cart) {
      if (
        item.operationType === OperationType.SORTIE &&
        item.quantity > item.stockQuantity
      ) {
        setError(`Quantité pour ${item.name} dépasse le stock disponible`);
        return;
      }
    }

    try {
      await createMovement({
        ticketId,
        userUUID: "TODO_USER_UUID",
        date: new Date().toISOString(),
        lines: cart.map((item) => ({
          productBarcode: item.barcode,
          operationType: item.operationType,
          quantity: item.quantity,
          price: item.price,
        })),
      });
    } catch (err: unknown) {
      setError((err as Error).message);
      return;
    }

    if (ticketRef.current) {
      const canvas = await html2canvas(ticketRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "mm", format: "a6" });
      pdf.addImage(
        imgData,
        "PNG",
        5,
        5,
        90,
        (canvas.height * 90) / canvas.width
      );
      pdf.save(`${ticketId}.pdf`);
    }

    setCart([]);
    setProductBarcode("");
    setError(null);
  };

  return (
    <div className="page-wrapper">
      {/* LEFT SIDE */}
      <div className="left-panel">
        <h2 className="page-title">EASY Cash Register</h2>

        {/* Sélecteur de type de mouvement */}
        <div className="input-row">
          <select
            value={operationType}
            onChange={(e) => setOperationType(e.target.value as OperationType)}
            className="operation-select"
          >
            <option value={OperationType.SORTIE}>
              VENTE (Sortie de stock)
            </option>
            <option value={OperationType.ENTREE}>
              ACHAT / Réception (Entrée)
            </option>
          </select>
        </div>

        {/* Bandeau visuel */}
        <div
          className={`transaction-type-label ${
            operationType === OperationType.SORTIE ? "vente" : "achat"
          }`}
        >
          {operationType === OperationType.SORTIE
            ? "🛒 Mode VENTE"
            : "📦 Mode ACHAT / RÉCEPTION"}
        </div>

        <div className="input-row">
          <TextBox
            value={productBarcode}
            onValueChanged={(e) => setProductBarcode(e.value)}
            placeholder="Code-barres ou code+quantité (ex. 123456+2)"
            className="w-full"
          />
          <Button
            icon="search"
            stylingMode="contained"
            type="default"
            onClick={handleLookup}
          />
        </div>

        {error && <div className="error-text">{error}</div>}

        <div className="table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Qté</th>
                <th>Prix</th>
                <th>Total</th>
                <th>+</th>
                <th>🗑️</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toFixed(2)} €</td>
                  <td>{(item.price * item.quantity).toFixed(2)} €</td>
                  <td>
                    <Button
                      icon="add"
                      stylingMode="text"
                      onClick={() => increaseQty(item.barcode)}
                    />
                  </td>
                  <td>
                    <Button
                      icon="trash"
                      stylingMode="text"
                      onClick={() =>
                        setCart((prev) => prev.filter((_, i) => i !== idx))
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="numpad">
          {[
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            ".",
            "0",
            "+",
            "-",
            "*",
          ].map((val, idx) => (
            <Button
              key={idx}
              text={val}
              onClick={() =>
                setProductBarcode((prev) => (prev === "0" ? val : prev + val))
              }
              height={60}
            />
          ))}
          <Button
            text="←"
            onClick={() =>
              setProductBarcode((prev) =>
                prev.length <= 1 ? "" : prev.slice(0, -1)
              )
            }
            height={60}
          />
          <Button
            text="CLR"
            onClick={() => setProductBarcode("")}
            height={60}
          />
          <Button text="OK" type="success" height={60} onClick={handleLookup} />
        </div>

        <Button
          text="Imprimer Ticket"
          type="success"
          width="100%"
          onClick={handlePrint}
          className="success-btn"
        />
      </div>

      {/* RIGHT SIDE - VISUAL TICKET */}
      <div className="right-panel">
        <div ref={ticketRef} className="ticket-preview">
          <div className="ticket-header">🧾 EASY SHOP</div>
          <div className="ticket-line ticket-mode">
            {operationType === OperationType.SORTIE
              ? "VENTE"
              : "ACHAT / RÉCEPTION"}
          </div>
          <div className="ticket-line">
            <span>Ticket#</span>
            <span>{ticketId}</span>
          </div>
          <div className="ticket-line">
            <span>Date</span>
            <span>{new Date().toLocaleString()}</span>
          </div>
          <hr className="my-2" />
          {cart.map((item, idx) => (
            <div key={idx} className="ticket-line">
              <span>
                {item.name} ×{item.quantity}
              </span>
              <span>{(item.price * item.quantity).toFixed(2)} €</span>
            </div>
          ))}
          <hr className="my-2" />
          <div className="ticket-line ticket-total">
            <span>Total</span>
            <span>{totalAmount.toFixed(2)} €</span>
          </div>
          <div className="text-center mt-2">Merci de votre visite !</div>
        </div>
      </div>
    </div>
  );
};

export default OperatorNewMovementPage;
