// EASY-TRACABILITY: frontend/src/features/operateur/pages/OperatorNewMovementPage.tsx

import React, { useState, useRef } from "react";
import { useProducts } from "../../../hooks/useProduct";
import { useInventoryMovements } from "../../../hooks/useInventoryMovement";
import { OperationType } from "../../../types/inventoryMovement";
import { Button } from "devextreme-react/button";
import { TextBox } from "devextreme-react/text-box";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../styles/NewMovementPage.css";

// On s'appuie sur le type Product renvoyé par le backend, qui contient stockQuantity
interface CartItem {
  barcode: string;
  name: string;
  quantity: number;
  price: number;
  operationType: OperationType;
  stockQuantity: number;
}

const OperatorNewMovementPage: React.FC = () => {
  const { products } = useProducts(); // products: Product[] avec stockQuantity
  const { addMovement } = useInventoryMovements();

  const [productBarcode, setProductBarcode] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ticketId] = useState(() => `TICKET-${Date.now()}`);
  const ticketRef = useRef<HTMLDivElement>(null);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleLookup = () => {
    const found = products.find((p) => p.barcode === productBarcode);
    if (!found) {
      setError("Produit non trouvé");
      return;
    }

    const stock = found.stockQuantity;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.barcode === found.barcode);

      if (existing) {
        const newQty = existing.quantity + 1;
        if (newQty > stock) {
          setError(`Quantité en stock insuffisante (max ${stock})`);
          return prevCart;
        }
        setError(null);
        return prevCart.map((item) =>
          item.barcode === found.barcode ? { ...item, quantity: newQty } : item
        );
      }

      if (stock < 1) {
        setError("Aucun stock disponible pour ce produit");
        return prevCart;
      }

      setError(null);
      return [
        ...prevCart,
        {
          barcode: found.barcode,
          name: found.name,
          quantity: 1,
          price: found.price,
          operationType: OperationType.ENTREE,
          stockQuantity: stock,
        },
      ];
    });

    setProductBarcode("");
  };

  const increaseQty = (barcode: string) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.barcode === barcode) {
          const newQty = item.quantity + 1;
          if (newQty > item.stockQuantity) {
            setError(
              `Quantité en stock insuffisante (max ${item.stockQuantity})`
            );
            return item;
          }
          setError(null);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handlePrint = async () => {
    if (cart.length === 0) {
      setError("Veuillez ajouter au moins un produit");
      return;
    }

    for (const item of cart) {
      if (item.quantity > item.stockQuantity) {
        setError(`Quantité pour ${item.name} dépasse le stock disponible`);
        return;
      }
    }

    for (const item of cart) {
      await addMovement({
        productBarcode: item.barcode,
        date: new Date(),
        operationType: item.operationType,
        quantity: item.quantity,
      });
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
        <div className="input-row">
          <TextBox
            value={productBarcode}
            onValueChanged={(e) => setProductBarcode(e.value)}
            placeholder="Code-barres produit"
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
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0].map((val, idx) => (
            <Button
              key={idx}
              text={val.toString()}
              onClick={() =>
                setProductBarcode((prev) =>
                  prev === "0" ? val.toString() : prev + val.toString()
                )
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
          <Button text="OK" type="success" height={60} onClick={handleLookup} />
          <Button
            text="CLR"
            onClick={() => setProductBarcode("")}
            height={60}
          />
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
