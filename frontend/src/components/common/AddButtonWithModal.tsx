// EASY-TRACABILITY:frontend/src/components/common/AddButtonWithModal.tsx

import React, { ReactNode, useState } from "react";
import GenericModal from "./GenericModal";
import "./styles/AddButtonWithModal.css"; // styles optionnels
import { Button } from "devextreme-react/button";

interface AddButtonWithModalProps {
  /** Label du bouton principal */
  buttonLabel: string;
  /** Titre affiché en haut du modal */
  modalTitle: string;
  /** Contenu du formulaire (champs, inputs…) à afficher dans le modal */
  children: ReactNode;
  /** Callback asynchrone appelé quand on clique sur « Enregistrer » */
  onConfirm: () => Promise<void> | void;
  keepOpen?: boolean; // ← new
}

const AddButtonWithModal: React.FC<AddButtonWithModalProps> = ({
  buttonLabel,
  modalTitle,
  children,
  onConfirm,
  keepOpen = false, // ← défaut false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const handleConfirm = async () => {
    await onConfirm();
    if (!keepOpen) close(); // ← ne ferme que si keepOpen===false
  };
  return (
    <>
      <Button text={buttonLabel} onClick={open} type="default" />
      <GenericModal
        isOpen={isOpen}
        title={modalTitle}
        onClose={close}
        onSubmit={handleConfirm}
      >
        {children}
      </GenericModal>
    </>
  );
};

export default AddButtonWithModal;
