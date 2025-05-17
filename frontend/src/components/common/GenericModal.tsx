// EASY-TRACABILITY:frontend/src/components/common/GenericFormModal.tsx

import React, { ReactNode, useState } from "react";
import ReactDOM from "react-dom";
import NotificationBar from "../ui/NotificationBar";
import { Button } from "devextreme-react/button";
import "./styles/InputField.css";
import "./styles/GenericModal.css";

export interface GenericModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onSubmit: () => Promise<void> | void;
  submitLabel?: string;
  cancelLabel?: string;
}

const GenericFormModal: React.FC<GenericModalProps> = ({
  isOpen,
  title,
  children,
  onClose,
  onSubmit,
  submitLabel = "Enregistrer",
  cancelLabel = "Annuler",
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit();
      setSuccess(true);
    } catch (err: unknown) {
      setError((err as Error).message || "Erreur inattendue");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="generic-modal-overlay" onClick={onClose}>
      <div
        className="generic-modal-box auth-container"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          icon="close"
          stylingMode="text"
          onClick={onClose}
          elementAttr={{ "aria-label": "Fermer" }}
          className="generic-modal-close-button"
        />
        <img src="/logo2.png" alt="logo" className="auth-logo" />
        <h2 className="auth-title">{title}</h2>

        {error && <NotificationBar message={error} type="error" />}
        {success && (
          <NotificationBar message="✅ Enregistrement réussi" type="success" />
        )}

        <div className="auth-form-wrapper">
          {children}
          <div className="forgot-link" />
        </div>

        <div className="form-actions">
          <button
            className="btn-primary-auth"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Enregistrement..." : submitLabel}
          </button>
          <button
            className="btn-secondary-auth"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GenericFormModal;
