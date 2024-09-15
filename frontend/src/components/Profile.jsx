import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator"
import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState({ username: "" });

  useEffect(() => {
    axios
      .get(`http://localhost:8000/profile/details/${id}`)
      .then((result) => {
        console.log(result);
        setProfile(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <CardContent className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-muted">
            {/* <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src="/home1.jpeg" alt={profile.username} />
              <AvatarFallback>{profile.username?.charAt(0)}</AvatarFallback>
            </Avatar> */}
            <CardTitle className="text-2xl font-bold text-center">
              {profile.username}
            </CardTitle>
          </CardContent>

          <div className="md:col-span-2 p-6">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Address: 123 Nehrunagar, Ahmedabad</p>
                <p>Email: alice@gmail.com</p>
                <p>Mobile Number: 1234567890</p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">For Sale</h3>
                    <ScrollArea className="h-40">
                      {[1, 2, 3, 4].map((_, index) => (
                        <Card key={index} className="mb-2 p-3">
                          <h4 className="font-medium">Property Name</h4>
                          <p className="text-sm text-muted-foreground">
                            Property Address
                          </p>
                        </Card>
                      ))}
                    </ScrollArea>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Favourite</h3>
                    <ScrollArea className="h-40">
                      {[1, 2, 3, 4].map((_, index) => (
                        <Card key={index} className="mb-2 p-3">
                          <h4 className="font-medium">Property Name</h4>
                          <p className="text-sm text-muted-foreground">
                            Property Address
                          </p>
                        </Card>
                      ))}
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Instagram className="h-6 w-6" />
                  <Facebook className="h-6 w-6" />
                  <Twitter className="h-6 w-6" />
                  <Linkedin className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
