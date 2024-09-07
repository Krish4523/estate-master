import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { PropertySchema } from "@/utils/schemas.js";
import { useAuth } from "@/contexts/AuthContext.jsx";

function AddProperty() {
  const { authToken, user } = useAuth();
  const [agents, setAgents] = useState([]);

  const form = useForm({
    resolver: zodResolver(PropertySchema),
    defaultValues: {
      title: "",
      description: "",
      property_type: "",
      price: "",
      local_address: "",
      city: "",
      state: "",
      pincode: "",
      sqft: "",
      bedrooms: "",
      parking: "",
      agent: "",
      images: [],
    },
  });

  // Fetch agents from API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/agents/`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );
        setAgents(response.data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
    fetchAgents();
  }, [authToken]);

  const onSubmit = async (data) => {
    data.is_varified = false;
    data.is_sold = false;
    data.seller = user.id;
    console.log(data);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/property/save/`,
        data,
        {
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      // const responseMsg =
      //   response.data.message === "successful"
      //     ? "Property Registered Successfully"
      //     : "Property Already Exists";
      // document.getElementById("op").innerText = responseMsg;
      // document.getElementById("op").style.color =
      //   response.data.message === "successful" ? "green" : "red";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">Add Property</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Property Type */}
          <FormField
            control={form.control}
            name="property_type"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Agent Selection */}
          <FormField
            control={form.control}
            name="agent"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ""}
                  >
                    <SelectTrigger>
                      {/* Display the agent's name */}
                      <SelectValue placeholder="Select Agent">
                        {field.value
                          ? agents.find((agent) => agent.id === field.value)
                              ?.name
                          : "Select Agent"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={String(agent.id)}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price Field */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter Your Price"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Local Address Field */}
          <FormField
            control={form.control}
            name="local_address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Local Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City Field */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* State Field */}
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pincode Field */}
          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" placeholder="PIN Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Square Feet Field */}
          <FormField
            control={form.control}
            name="sqft"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" placeholder="Area (sqft)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bedrooms Field */}
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" placeholder="Bedrooms" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Parking Field */}
          <FormField
            control={form.control}
            name="parking"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Parking Spaces"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      field.onChange(files);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
      <h2 id="op" className="text-center mt-4"></h2>
    </div>
  );
}

export default AddProperty;
