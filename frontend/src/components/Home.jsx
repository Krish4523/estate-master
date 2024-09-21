import i1 from "@/assets/images/image1.webp";
import i2 from "@/assets/images/image2.jpg";
import { Card, CardFooter } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import logo from "@/assets/estatemaster-logo-transparent.svg";
import { BedDouble, Car, ChartArea, Mail, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/utils/formatter";

function Home() {
  const [topProperties, setTopProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/property/list`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );
        setTopProperties(response.data.slice(0, 6));
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    fetchListings();
  }, [authToken]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/agents/`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );
        console.log(response.data);
        setAgents(response?.data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
    fetchAgents();
  }, [authToken, setAgents]);

  return (
    <div className="space-y-4 md:space-y-10">
      <div className="block sm:hidden p-2">
        <h4 className="text-2xl font-semibold">Welcome to EstateMaster</h4>
      </div>
      {/* Welcome Section */}
      <div className="relative p-2">
        <img
          src={i1}
          alt=""
          className="w-full h-auto md:h-[500px] object-cover rounded-xl"
        />
        <div className="absolute bottom-4 md:bottom-8 left-8 sm:right-20 sm:text-right">
          <h4 className="hidden sm:block text-2xl font-semibold">
            Welcome to EstateMaster
          </h4>
          <p className="text-lg sm:text-xl font-bold">
            Discover Exceptional Properties with EstateMaster
          </p>
        </div>
      </div>

      {/* Commitment Section */}
      <div className="flex flex-col md:flex-row gap-8 p-2">
        <div className="flex-1">
          <img src={i2} alt="" className="w-full h-auto rounded-xl" />
        </div>
        <div className="flex-1 flex flex-col items-start justify-center space-y-6">
          <p className="text-gray-500">Unveiling our Journey</p>
          <h2 className="text-3xl font-bold leading-snug">
            Real Estate Experiences
          </h2>
          <p className="text-sm sm:text-base mt-6">
            Our clients are at the heart of everything we do. We strive to
            exceed your expectations by offering personalized service, expert
            advice, and a commitment to finding the perfect property to meet
            your needs.
          </p>
        </div>
      </div>

      {/* Properties Section */}
      <div className="bg-gray-700 p-6 text-white rounded-lg space-y-4">
        <div className="text-center">
          <p className="text-lg font-bold">Your Future Home Awaits!</p>
          <h2 className="text-3xl font-bold">Find Your Dream Property</h2>
          <p className="text-sm mt-4">
            <b>Showing 1-6</b> out of all properties
          </p>
        </div>
        <div className="flex overflow-x-auto scrollbar-hide gap-4">
          {topProperties.map((property) => (
            <Card
              key={property.id}
              className="min-w-[240px] p-4 bg-white text-black rounded-xl"
            >
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/${property.images[0]?.image}`}
                alt={property.title}
                className="w-full h-40 rounded-lg"
              />
              <div className="mt-4 space-y-2">
                <p className="text-gray-500 font-semibold">{property.city}</p>
                <h3 className="text-lg font-bold">{property.title}</h3>
                <CardFooter className="flex justify-between text-sm px-0 py-2">
                  <div className="flex items-center">
                    <BedDouble size={20} className="mr-1" /> {property.bedrooms}
                  </div>
                  <div className="flex items-center">
                    <Car size={20} className="mr-1" /> {property.parking}
                  </div>
                  <div className="flex items-center">
                    <ChartArea size={20} className="mr-1" /> {property.sqft}
                  </div>
                </CardFooter>
                <div className="flex justify-between items-center mt-4 mb-2">
                  <b>{formatCurrency(property.price)}</b>
                </div>
                <Link
                  to={`/property/${property.id}`}
                  key={property.id}
                  className="mt-2"
                >
                  <Button size="sm">View Details</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="p-4">
        <p className="text-lg font-bold text-gray-700">
          Meet Our Expert Agents!
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Your Trusted Property Advisors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {agents.slice(0, 4).map((agent) => (
            <div
              key={agent.user.id}
              className="relative w-full max-h-fit flex flex-col justify-center items-center bg-white shadow-lg rounded-xl p-4"
            >
              {agent.user.avatar ? (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/${agent.user.avatar}`}
                  alt="Profile"
                  className="object-cover size-48 rounded-full"
                />
              ) : (
                <User
                  size={80}
                  className="mx-auto bg-gray-500 size-48 rounded-full p-2 stroke-white"
                />
              )}
              <div className="mt-4 flex flex-col items-start w-full">
                <h3 className="text-xl font-bold">{agent.user.name}</h3>
                <p className="text-gray-500">{agent.user.email}</p>
                <p className="mt-2 font-semibold">Rating: {agent.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-gray-100 p-8 rounded-xl space-y-8">
        <div className="text-center">
          <h1 className="text-xl sm:text-3xl font-bold">
            Explore real estate opportunities with us
          </h1>
          <p className="text-gray-600 mt-4">
            Discover a world of possibilities with our expert guidance. Let us
            help you find your dream property.
          </p>
        </div>
        <Separator />
        <div className="flex flex-col gap-4 md:flex-row justify-center items-start space-y-8 md:space-y-0">
          <div className="flex-1 space-y-4">
            <Link to="/">
              <img src={logo} alt="logo" className="h-full w-40" />
            </Link>
            <p className="text-sm text-gray-600">Real Estate redefined</p>
          </div>

          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-bold">Our Community</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <Link to="/listings">
                <li>Listings</li>
              </Link>
              <Link to="/appointments">
                <li>Appointments</li>
              </Link>
              <Link to="/add-property">
                <li>Add Property</li>
              </Link>
              <Link to="/profile">
                <li>Profile</li>
              </Link>
            </ul>
          </div>

          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-bold">Contact Us</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Phone size={16} /> <span>123-456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} /> <span>admin@admin.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
