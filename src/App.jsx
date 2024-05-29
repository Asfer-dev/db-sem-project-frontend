import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TicketsPage from "./components/tickets-page";
import BuyTicket from "./components/buy-ticket";
import LoginPage from "./components/login-page";
import Profile from "./components/profile";
import SignupPage from "./components/signup-page";
import Navigation from "./components/navigation";
import { Toaster } from "./components/ui/toaster";
import AdminPage from "./components/admin-page";

function App() {
  return (
    <BrowserRouter>
      <Navigation />

      <main className="py-8 px-4 max-w-[1150px] mx-auto">
        <Routes>
          <Route path="/" element={<TicketsPage />} />
          <Route path="/buy-ticket" element={<BuyTicket />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      <Toaster />
    </BrowserRouter>
  );
}

export default App;
