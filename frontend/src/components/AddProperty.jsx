/*
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function AddProperty() {
  const [data, setData] = useState({});

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    data["is_available"] = true;
    data["seller"] = 1;
    data["agent"] = 1;
    let responseMsg = "";
    axios
      .post("http://localhost:8000/property/save/", data)
      .then((response) => {
        if (response.data.message === "successful") {
          document.getElementById("op").style.color = "green";
          responseMsg = "Property Registered Successfully";
        } else {
          document.getElementById("op").style.color = "red";
          responseMsg = "Property Already Exists";
        }
        document.getElementById("op").innerText = responseMsg;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6">Add Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="title"
          value={data.title || ""}
          placeholder="Enter Title"
          onChange={handleChange}
        />
        <Textarea
          name="description"
          value={data.description || ""}
          placeholder="Description"
          onChange={handleChange}
        />
        <Select
          name="property_type"
          value={data.property_type}
          onValueChange={(value) =>
            handleChange({ target: { name: "property_type", value } })
          }
        >
          <SelectTrigger className="w-full">Type</SelectTrigger>
          <SelectContent>
            <SelectItem value="residential">Residential</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="industrial">Industrial</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          name="price"
          value={data.price || ""}
          placeholder="Enter Your Price"
          onChange={handleChange}
        />
        <Input
          type="text"
          name="local_address"
          value={data.local_address || ""}
          placeholder="Local Address"
          onChange={handleChange}
        />
        <Input
          type="text"
          name="city"
          value={data.city || ""}
          placeholder="City"
          onChange={handleChange}
        />
        <Input
          type="text"
          name="state"
          value={data.state || ""}
          placeholder="State"
          onChange={handleChange}
        />
        <Input
          type="number"
          name="pincode"
          value={data.pincode || ""}
          placeholder="PIN"
          onChange={handleChange}
        />
        <Input
          type="number"
          name="sqft"
          value={data.sqft || ""}
          placeholder="Area (sqft)"
          onChange={handleChange}
        />
        <Input
          type="number"
          name="bedrooms"
          value={data.bedrooms || ""}
          placeholder="Bedrooms"
          onChange={handleChange}
        />
        <Input
          type="number"
          name="parking"
          value={data.parking || ""}
          placeholder="Parking"
          onChange={handleChange}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
      <h2 id="op" className="text-center mt-4"></h2>
    </div>
  );
}

export default AddProperty;
*/
import React from "react";
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

function AddProperty() {
  const form = useForm({
    resolver: zodResolver(PropertySchema),
    defaultValues: {
      title: "",
      description: "",
      property_type: "residential",
      price: "",
      local_address: "",
      city: "",
      state: "",
      pincode: "",
      sqft: "",
      bedrooms: "",
      parking: "",
      images: [],
    },
  });

  const onSubmit = async (data) => {
    data.is_available = true;
    data.seller = 1;
    data.agent = 1;

    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (key === "images") {
        value.forEach((file) => formData.append("images", file));
      } else {
        formData.append(key, value);
      }
    }
    console.log(data);
    console.log(formData);
    try {
      const response = await axios.post(
        "http://localhost:8000/property/save/",
        formData
      );
      const responseMsg =
        response.data.message === "successful"
          ? "Property Registered Successfully"
          : "Property Already Exists";
      document.getElementById("op").innerText = responseMsg;
      document.getElementById("op").style.color =
        response.data.message === "successful" ? "green" : "red";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">Add Property</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
