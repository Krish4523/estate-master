import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import i1 from "@/assets/images/home1.jpeg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CircleCheckBig,
  Heart,
  Mail,
  Phone,
  Edit,
  Lock,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { changePasswordSchema, editProfileSchema } from "@/utils/schemas";
import toast from "react-hot-toast";

function Profile() {
  const { id } = useParams();
  const { user, authToken } = useAuth();
  console.log(user);
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user?.avatar || i1,
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || i1);
  const [userDetails, setUserDetails] = useState({});
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const editProfileForm = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone,
    },
  });

  const changePasswordForm = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    const getProperties = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/profile/${user.id}`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );
        const data = { role: response.data.user.role };
        console.log(response.data);
        if (data.role === "customer") {
          data.favProperties = response.data.fav_properties;
          data.ownProperties = response.data.own_properties;
        } else {
          data.inquiryListings = response.data.inquiry_listings;
          data.activeListings = response.data.active_listings;
        }
        console.log(data);
        setUserDetails(data);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
      }
    };
    getProperties();
  }, [authToken, editProfileForm, id, user.id]);

  const handleEditProfile = async (data) => {
    try {
      setShowEditDialog(true);
      console.log(data);

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/profile/edit/${user.id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${authToken}`,
          },
        }
      );
      console.log(response);
      setProfile({ ...profile, ...response.data });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response.data.message);
    } finally {
      setShowEditDialog(false);
    }
  };

  const handleChangePassword = async (data) => {
    console.log(data);
    try {
      setShowPasswordDialog(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/change-password/`,
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${authToken}`,
          },
        }
      );
      console.log(response);
      toast.success(response.data.message);
      changePasswordForm.reset();
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error?.response?.data?.error);
    } finally {
      setShowPasswordDialog(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      editProfileForm.setValue("avatar", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:min-h-[calc(100vh-6rem)]">
        {/* Left Column */}
        <div className="md:col-span-1">
          <Card className="h-full p-2 sm:p-6">
            <CardContent className="flex p-1 flex-col items-center space-y-4">
              <Avatar className="w-28 h-28">
                <AvatarImage
                  src={
                    `${import.meta.env.VITE_API_BASE_URL}${profile.avatar}` ||
                    i1
                  }
                  alt="Profile"
                />
                <AvatarFallback>
                  {profile.name ? profile.name[0] : "A"}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-xl sm:text-2xl font-bold">{profile.name}</h1>
              <div className="w-full space-y-2">
                <div className="flex items-center text-sm gap-1 sm:gap-2">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center text-sm gap-1 sm:gap-2">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <span>{profile.phone}</span>
                </div>
              </div>
              <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <Form {...editProfileForm}>
                    <form
                      onSubmit={editProfileForm.handleSubmit(handleEditProfile)}
                      className="space-y-4"
                    >
                      <FormField
                        control={editProfileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={editProfileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormItem>
                        <FormLabel>Avatar</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                          />
                        </FormControl>
                        {avatarPreview && (
                          <img
                            src={avatarPreview}
                            alt="Avatar Preview"
                            className="mt-2 w-20 h-20 object-cover rounded-full"
                          />
                        )}
                      </FormItem>
                      <Button type="submit" disabled={showEditDialog}>
                        {showEditDialog ? "Loading..." : "Save Changes"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              <Dialog
                open={showPasswordDialog}
                onOpenChange={setShowPasswordDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <Form {...changePasswordForm}>
                    <form
                      onSubmit={changePasswordForm.handleSubmit(
                        handleChangePassword
                      )}
                      className="space-y-4"
                    >
                      <FormField
                        control={changePasswordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={changePasswordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={changePasswordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={showPasswordDialog}>
                        {showPasswordDialog ? "Loading..." : "Change Password"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 flex flex-col">
          <Card className="flex-grow">
            <CardHeader>
              <CardTitle>
                {userDetails.role === "customer" ? "Properties" : "Listings"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 sm:pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
              {userDetails.role === "customer" ? (
                <>
                  {/* For Sale (Customer Owned Properties) */}
                  <div className="flex flex-col h-full">
                    <h2 className="flex ml-2 items-center gap-2 font-semibold mb-2">
                      <CircleCheckBig size={20} />
                      <span>Owned Properties</span>
                    </h2>
                    <ScrollArea className="flex-grow h-60 sm:h-[calc(100vh-14rem)] p-2">
                      {userDetails.ownProperties?.length > 0 ? (
                        userDetails.ownProperties.map((property, index) => (
                          <Card key={index} className="mb-2 p-3">
                            <Link
                              to={`/property/${property.id}`}
                              key={property.id}
                            >
                              <h4 className="font-medium mb-1">
                                {property.title}
                              </h4>
                            </Link>
                            <p className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin size={20} />{" "}
                              <span>
                                {property.city}
                                {", "}
                                {property.state}
                              </span>
                            </p>
                          </Card>
                        ))
                      ) : (
                        <p>No owned properties</p>
                      )}
                    </ScrollArea>
                  </div>
                  {/* Favorites (Customer Favorite Properties) */}
                  <div className="flex flex-col h-full">
                    <h2 className="flex ml-2 items-center gap-2 font-semibold mb-2">
                      <Heart
                        size={20}
                        className="fill-red-500 stroke-red-500"
                      />
                      <span>Favorites</span>
                    </h2>
                    <ScrollArea className="flex-grow h-60 sm:h-[calc(100vh-20rem)] p-2">
                      {userDetails.favProperties?.length > 0 ? (
                        userDetails.favProperties.map((property, index) => (
                          <Card key={index} className="mb-2 p-3">
                            <h4 className="font-medium">{property.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {property.address}
                            </p>
                          </Card>
                        ))
                      ) : (
                        <p>No favorite properties</p>
                      )}
                    </ScrollArea>
                  </div>
                </>
              ) : (
                <>
                  {/* Inquiry Listings (Agent) */}
                  <div className="flex flex-col h-full">
                    <h2 className="flex ml-2 items-center gap-2 font-semibold mb-2">
                      <CircleCheckBig size={20} />
                      <span>Inquiry Listings</span>
                    </h2>
                    <ScrollArea className="flex-grow h-60 sm:h-[calc(100vh-14rem)] p-2">
                      {userDetails.inquiryListings?.length > 0 ? (
                        userDetails.inquiryListings.map((listing, index) => (
                          <Card key={index} className="mb-2 p-3">
                            <h4 className="font-medium">{listing.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {listing.address}
                            </p>
                          </Card>
                        ))
                      ) : (
                        <p>No inquiry listings</p>
                      )}
                    </ScrollArea>
                  </div>
                  {/* Active Listings (Agent) */}
                  <div className="flex flex-col h-full">
                    <h2 className="flex ml-2 items-center gap-2 font-semibold mb-2">
                      <Heart
                        size={20}
                        className="fill-red-500 stroke-red-500"
                      />
                      <span>Active Listings</span>
                    </h2>
                    <ScrollArea className="flex-grow h-60 sm:h-[calc(100vh-20rem)] p-2">
                      {userDetails.activeListings?.length > 0 ? (
                        userDetails.activeListings.map((listing, index) => (
                          <Card key={index} className="mb-2 p-3">
                            <h4 className="font-medium">{listing.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {listing.address}
                            </p>
                          </Card>
                        ))
                      ) : (
                        <p>No active listings</p>
                      )}
                    </ScrollArea>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Profile;
