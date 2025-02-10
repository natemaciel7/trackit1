import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./AuthContext";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Habits from "./pages/Habits";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<SignUp />} />
          <Route path="/habitos" element={<Habits />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
