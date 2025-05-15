// EASY-TRACABILITY:frontend/src/App.tsx

import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/app.routes";
import { AuthProvider } from "./features/auth/context";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
