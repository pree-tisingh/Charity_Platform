import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile/Profile";
import UpdateProfile from "./components/Profile/UpdateProfile";
import DonationList from "./components/DonationList";
import AddDonation from "./components/AddDonation";
import Home from "./components/Home";
import CharityRegistration from './components/CharityRegistration';
import CharityProfile from './components/CharityProfile';
import EditCharityProfile from "./components/EditCharityProfile";
import CharityList from "./components/CharityList";
import CharityDetail from "./components/CharityDetails";
import AdminDashboard from "./components/AdminDashboard";

import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/donations" element={<DonationList />} />
        <Route path="/add-donation" element={<AddDonation />} />
        <Route path="/register-charity" element={<CharityRegistration />} />
        <Route path="/charity/:id/edit" element={<EditCharityProfile />} />
        <Route path="/charities" element={<CharityList />} />
        <Route path="/charities/:id" element={<CharityDetail />} />
        <Route path="/charity/:id" element={<CharityProfile />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
