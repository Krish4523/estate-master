import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BedDouble,
  Car,
  ChartArea,
  MapPin,
  Search,
  Building,
} from "lucide-react";
import axios from "axios";
import { Input } from "@/components/ui/input.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { formatCurrency } from "@/utils/formatter.js";

function Listing() {
  const { authToken } = useAuth();
  const [filter, setFilter] = useState({
    bed: "all",
    price: "all",
    parking: "all",
    search: "",
    type: "all",
  });
  const [homes, setHomes] = useState([]);

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
        setHomes(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    fetchListings();
  }, [authToken]);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredHomes = homes.filter((home) => {
    return (
      (filter.bed === "all" || home.bedrooms === parseInt(filter.bed)) &&
      (filter.price === "all" || home.price <= parseInt(filter.price)) &&
      (filter.parking === "all" || home.parking === parseInt(filter.parking)) &&
      (filter.type === "all" || home.property_type === filter.type) &&
      (filter.search === "" ||
        home.local_address.toLowerCase().includes(filter.search.toLowerCase()))
    );
  });

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-20">
      <div className="flex-1">
        {/* Search and Filter Section */}
        <div className="p-4 space-y-4">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </span>
            <Input
              type="text"
              placeholder="Search Property Address"
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              className="pl-8 w-full"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Bedrooms Select */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Bedroom
              </label>
              <Select
                name="bed"
                value={filter.bed}
                onValueChange={(value) =>
                  handleFilterChange({
                    target: {
                      name: "bed",
                      value,
                    },
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Bedroom" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Select */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Price</label>
              <Select
                name="price"
                value={filter.price}
                onValueChange={(value) =>
                  handleFilterChange({
                    target: {
                      name: "price",
                      value,
                    },
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="1500000">
                    upto {formatCurrency(1500000)}
                  </SelectItem>
                  <SelectItem value="2000000">
                    upto {formatCurrency(2000000)}
                  </SelectItem>
                  <SelectItem value="4000000">
                    upto {formatCurrency(4000000)}
                  </SelectItem>
                  <SelectItem value="6000000">
                    upto {formatCurrency(6000000)}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Parking Select */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Parking
              </label>
              <Select
                name="parking"
                value={filter.parking}
                onValueChange={(value) =>
                  handleFilterChange({
                    target: {
                      name: "parking",
                      value,
                    },
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Parking" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Property Type Select */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <Select
                name="type"
                value={filter.type}
                onValueChange={(value) =>
                  handleFilterChange({
                    target: {
                      name: "type",
                      value,
                    },
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* List of Homes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 p-4">
          {filteredHomes.map((home) => (
            <Link to={`/property/${home.id}`} key={home.id}>
              <Card
                className="transition-transform transform hover:shadow-lg"
                key={home.id}
              >
                <CardHeader className="p-2">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/${home.images[0]?.image}`}
                    alt="Home"
                    className="w-full h-40 object-cover rounded-t-md"
                  />
                </CardHeader>
                <CardContent className="px-4 py-2">
                  <CardTitle className="flex justify-between flex-wrap gap-2 text-lg font-semibold">
                    <span>{home.title}</span>
                    <span>{formatCurrency(home.price)}</span>
                  </CardTitle>
                  <CardDescription className="flex flex-col gap-2 text-sm mt-2">
                    <span className="flex items-center">
                      <MapPin size={20} className="mr-1" /> {home.local_address}
                    </span>
                    <span className="flex items-center">
                      <Building size={20} className="mr-1" /> {home.city}
                      {", "}
                      {home.state}
                    </span>
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex justify-between text-sm px-4 py-2">
                  <div className="flex items-center">
                    <BedDouble size={20} className="mr-1" /> {home.bedrooms}
                  </div>
                  <div className="flex items-center">
                    <Car size={20} className="mr-1" /> {home.parking}
                  </div>
                  <div className="flex items-center">
                    <ChartArea size={20} className="mr-1" /> {home.sqft}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Listing;
