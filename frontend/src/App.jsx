import { AuthProvider } from "@/contexts/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import Layout from "@/components/Layout.jsx";
import Verify from "@/components/Verify";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/components/Home.jsx";
import Listing from "@/components/Listing.jsx";
import AddProperty from "@/components/AddProperty.jsx";
import { Toaster } from "react-hot-toast";
import Property from "@/components/Property.jsx";
import Profile from "@/components/Profile";

function App() {
  return (
    <Router>
      <Toaster
        position="bottom-right"
        reverseOrder={true}
        toastOptions={{ duration: 3000 }}
        containerStyle={{ zIndex: 99 }}
      />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/" element={<ProtectedRoute element={<Layout />} />}>
            {/*<Route path="/" element={<Layout />}>*/}
            <Route path="" element={<Home />} />
            <Route path="listings" element={<Listing />} />
            <Route path="add-property" element={<AddProperty />} />
            <Route path="property/:id" element={<Property />} />
            <Route path="profile" element={<Profile />} />
            {/*<Route path="about" element={<About />} />*/}
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
