// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import LoginPage from "./Page/LoginPage";
import { AuthProvider } from "./Context/Context.js";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard/*" element={<Layout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
