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

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/" element={<ProtectedRoute element={<Layout />} />}>
            {/*<Route path="/" element={<Layout />}>*/}
            <Route path="" element={<Home />} />
            <Route path="listing" element={<Listing />} />
            <Route path="add" element={<AddProperty />} />
            {/*<Route path="about" element={<About />} />*/}
            {/*<Route path="login" element={<Login />} />*/}
            {/*<Route path="signup" element={<Signup />} />*/}
            {/*<Route path="property" element={<Property />} />*/}
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
