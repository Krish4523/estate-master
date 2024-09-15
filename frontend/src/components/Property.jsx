import { useState, useEffect } from "react";
import i1 from "@/assets/images/home1.jpeg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Bed, Car, Image, LandPlot, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { formatCurrency } from "@/utils/formatter.js";

function Property() {
  const { id } = useParams();
  const { authToken } = useAuth();

  const navigate = useNavigate();
  const [home, setHome] = useState([]);
  const [agent, setAgent] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [data, setData] = useState({
    property: id,
    applicant: 1,
    description: "Enter Description",
  });

  const handleConfirm = () => {
    console.log(data);
    const bookAppointment = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/appointment/book/`,
          data,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );
        console.log(response.data);
        toast.success("Appointment booked successfully");
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data.message);
      }
    };
    bookAppointment();
    setShowDialog(false);
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/property/${id}`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );
        console.log(response.data);
        setHome(response.data);
      } catch (err) {
        console.log(err);
        toast.error(err.response?.data?.message);
        navigate("/listings");
      }
    };
    fetchProperty();
  }, [authToken, id, navigate, setHome]);

  useEffect(() => {
    if (home.agent) {
      const fetchAgent = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/agents/${home.agent}`,
            {
              headers: {
                Authorization: `Token ${authToken}`,
              },
            }
          );
          setAgent(response.data); // Set agent info
        } catch (err) {
          console.log(err);
          toast.error("Error fetching agent information.");
        }
      };

      fetchAgent();
    }
  }, [authToken, home.agent]);

  // console.log(home);
  // console.log(agent);

  return (
    <div className="flex flex-col lg:flex-row px-4 space-y-8 lg:space-y-0 lg:space-x-8">
      {/* Left side: Main content */}
      <div className="lg:w-2/3 space-y-8">
        {/* Image Section */}
        <div className="flex justify-center w-full px-4 lg:px-8">
          <Carousel className="w-full max-w-lg lg:max-w-none">
            <CarouselContent>
              {home.images && home.images.length ? (
                home.images.map(({ id, image }) => (
                  <CarouselItem
                    key={id}
                    className="flex aspect-video items-center justify-center"
                  >
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/${image}`}
                      alt={`Property-${id}`}
                      className="rounded-lg h-full object-cover"
                    />
                  </CarouselItem>
                ))
              ) : (
                <p>No Images available</p>
              )}
            </CarouselContent>
            <CarouselPrevious className="ms-4 sm:ms-0" />
            <CarouselNext className="me-4 sm:me-0" />
          </Carousel>
        </div>

        {/* Property Details */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-between font-bold text-xl sm:text-2xl">
            <h1>{home.title}</h1>
            <span>{formatCurrency(home.price)}</span>
          </div>
          <p className="flex items-center gap-2">
            <MapPin size={20} />{" "}
            {`${home.local_address}, ${home.city}, ${home.state}, ${home.pincode}`}
          </p>
        </div>

        {/* Agent Info */}
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <div className="flex items-center space-x-4">
            <img
              src={agent?.profile_image || i1}
              alt="Agent"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold">
                {agent?.user.name || "Unknown Agent"}
              </p>
              <p className="text-sm text-gray-500">
                Rating: {agent?.rating || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xl font-bold">Description</h3>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p>{home.description}</p>
          </div>
        </div>
      </div>

      {/* Right side: Sidebar */}
      <div className="lg:w-1/3 p-2 lg:p-6 lg:pe-0 rounded-lg space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Details</h2>
          <div className="flex gap-2 sm:gap-8 lg:gap-2 mt-2 text-sm">
            <div className="flex flex-wrap gap-1 bg-secondary p-2 rounded-md">
              <LandPlot size={20} />
              <span>{home.sqft} sqft</span>
            </div>
            <div className="flex flex-wrap gap-1 bg-secondary p-2 rounded-md">
              <Bed size={20} />
              <span>{home.bedrooms} beds</span>
            </div>
            <div className="flex flex-wrap gap-1 bg-secondary p-2 rounded-md">
              <Car size={20} />
              <span>{home.parking} parking</span>
            </div>
          </div>
        </div>

        {/* Nearby Places */}
        <div>
          <h2 className="text-xl font-semibold">Nearby Places</h2>
          <div className="bg-secondary p-4 rounded-md mt-2">
            <ol className="list-disc space-y-2 mx-2 text-sm">
              {home.nearby_places && home.nearby_places.length > 0 ? (
                home.nearby_places.map((place) => (
                  <li key={place.name}>
                    <h3 className="font-medium">
                      {place.name} ({place.place_type})
                    </h3>
                    <p>
                      {place.distance < 1
                        ? `${place.distance * 1000}m `
                        : `${place.distance}km `}
                      away
                    </p>
                  </li>
                ))
              ) : (
                <p>No Nearby Places</p>
              )}
            </ol>
          </div>
        </div>

        {/* Location */}
        <div>
          <h2 className="text-xl font-semibold">Location</h2>
          <div className="bg-secondary p-4 min-h-96 md:h-auto rounded-md mt-2">
            <Image className="w-full h-auto rounded-md" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <Button size="sm" onClick={() => setShowDialog(true)}>
            Book Appointment
          </Button>
          <Button size="sm" variant="outline">
            Add to Favorites
          </Button>
        </div>

        {/* Dialog for booking */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book a Date</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="date"
                value={data.date}
                onChange={(e) => setData({ ...data, date: e.target.value })}
              />
            </div>
            <DialogFooter className="flex justify-between flex-wrap gap-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirm}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Property;