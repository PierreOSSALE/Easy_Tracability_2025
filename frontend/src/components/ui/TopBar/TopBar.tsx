// EASY-TRACABILITY:frontend/src/components/ui/TopBar/TopBar.tsx
import "./TopBar.css";
import { Modal } from "../Modal/Modal";
import { useAuthContext } from "../../../features/auth/hooks/useAuthContext";
import { useSidebar } from "../SidebarContext";
import { useProfile } from "../../../hooks/useProfile";
import InputField from "../../common/InputField";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import React, { ReactNode, useState, useEffect, useCallback } from "react";

const extractUser = (p: any) => p.user ?? p;

interface TopBarProps {
  title: ReactNode;
}

export const TopBar = ({ title }: TopBarProps) => {
  const { user, logout } = useAuthContext();
  const { isOpen } = useSidebar();
  const { profile, update, refetch, loading } = useProfile();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"profile" | "logout">("profile");
  const [email, setEmail] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [serverPic, setServerPic] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const sidebarWidth = isOpen ? 193 : 64;

  useEffect(() => {
    if (!profile) return;
    const u = extractUser(profile);
    setEmail(u.email ?? "");
    setServerPic(u.profilePicture ?? null);
  }, [profile]);

  useEffect(
    () => () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  const openModal = useCallback(async () => {
    await refetch();
    setTab("profile");
    setOpen(true);
  }, [refetch]);

  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }, []);

  const onSubmit = useCallback(async () => {
    const e = email.trim();
    if (!e || !/\S+@\S+\.\S+/.test(e)) {
      toast.error("E-mail invalide");
      return;
    }
    await update({ email: e, profilePicture: file! });
    await refetch();
    setFile(null);
    setPreview(null);
    setOpen(false);
    toast.success("✅ Profil mis à jour");
  }, [email, file, update, refetch]);

  const onLogout = useCallback(() => {
    logout();
  }, [logout]);

  // Blob first, ensuite URL public, sinon défaut
  const raw = preview || serverPic;
  const avatarUrl = raw
    ? raw.startsWith("/")
      ? `${import.meta.env.VITE_API_BASE_URL}${raw}`
      : raw
    : "/default-avatar.png";

  return (
    <>
      <div
        className="topbar"
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100% - ${sidebarWidth}px)`,
        }}
      >
        <div className="topbar-left">
          <span className="title">{title}</span>
        </div>
        <div className="topbar-right">
          <button className="user-info" onClick={openModal}>
            <img src={avatarUrl} alt="avatar" className="avatar" />
            <div className="user-meta">
              <span className="username">{user?.username}</span>
              <span className="role">{user?.role}</span>
            </div>
          </button>
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <h4 className="modal-title">Paramètres</h4>
        <div className="modal-container">
          <div className="modal-left">
            <div
              className={`modal-section ${tab === "profile" ? "active" : ""}`}
            >
              <button onClick={() => setTab("profile")} className="modal-btn">
                Profile
              </button>
            </div>
            <div
              className={`modal-section ${tab === "logout" ? "active" : ""}`}
            >
              <button onClick={() => setTab("logout")} className="modal-btn">
                Logout
              </button>
            </div>
          </div>
          <div className="modal-right">
            {tab === "profile" ? (
              <div className="profile-edit">
                <div className="profile-avatar">
                  <label htmlFor="picInput">
                    <img src={avatarUrl} alt="avatar" className="avatar" />
                    <span className="camera-icon">📷</span>
                  </label>
                  <input
                    id="picInput"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={onFile}
                  />
                </div>
                <InputField
                  value={email}
                  onChange={setEmail}
                  icon="fa-solid fa-envelope"
                />
                <button
                  onClick={onSubmit}
                  className="modal-btn confirm"
                  disabled={loading || !email.trim()}
                >
                  Valider
                </button>
              </div>
            ) : (
              <div className="logout-confirm">
                <p>Prêt(e) pour une pause ?</p>
                <button onClick={onLogout} className="modal-btn confirm">
                  Déconnecter
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="modal-btn cancel"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};
