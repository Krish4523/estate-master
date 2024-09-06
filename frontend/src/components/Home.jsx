import i1 from "@/assets/images/home1.jpeg";
import { Card } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Input } from "@/components/ui/input.jsx";

function Home() {
  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="relative p-4">
        <img src={i1} alt="" className="w-full h-auto rounded-xl" />
        <div className="absolute bottom-10 left-20 w-3/4 text-white">
          <h4 className="text-2xl font-semibold">Welcome to PP</h4>
          <p className="text-xl font-bold">
            Discover Exceptional Properties with PP
          </p>
        </div>
      </div>

      {/* Commitment Section */}
      <div className="flex flex-col md:flex-row gap-8 p-4">
        <div className="flex-1">
          <img src={i1} alt="" className="w-full h-auto rounded-xl" />
        </div>
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <p className="text-gray-500">Unveiling our Journey</p>
          <h2 className="text-3xl font-bold leading-snug">
            Our Commitment Crafting Extraordinary Real Estate Experiences
          </h2>
          <p className="text-sm mt-6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos
            explicabo eius fugiat laudantium alias quae, excepturi illum aperiam
            laboriosam quidem voluptates necessitatibus.
          </p>
          <div className="flex justify-between items-center">
            {["10k+", "10k+", "10k+"].map((text, index) => (
              <div
                key={index}
                className="bg-gray-700 text-white p-4 rounded-lg"
              >
                <h4 className="text-xl font-bold">{text}</h4>
                <p>Happy Clients</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div className="bg-gray-700 p-6 text-white rounded-lg space-y-4">
        <div className="text-center">
          <p className="text-lg font-bold">Your Future Home Awaits!</p>
          <h2 className="text-3xl font-bold">Find Your Dream Here</h2>
          <p className="text-sm mt-4">
            <b>Showing 1-9</b> out of 3k properties
          </p>
        </div>
        <div className="flex overflow-x-auto scrollbar-hide gap-4">
          {[...Array(6)].map((_, index) => (
            <Card
              key={index}
              className="w-[240px] p-4 bg-white text-black rounded-xl"
            >
              <img src={i1} alt="" className="w-full h-40 rounded-lg" />
              <div className="mt-4 space-y-2">
                <p className="text-gray-500 font-semibold">Chicago</p>
                <h3 className="text-lg font-bold">
                  Riverside Retreat Tranquil
                </h3>
                <div className="flex justify-around text-sm">
                  <span>2</span>|<span>2</span>|<span>1</span>|<span>400</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <b>$3250.00</b>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Blogs Section */}
      <div className="p-4">
        <p className="text-lg font-bold text-gray-700">
          Stay Updated with the latest News!
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Our Expert Blogs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="relative w-full h-[240px]">
              <img
                src={i1}
                alt=""
                className="w-full h-full rounded-xl object-cover"
              />
              <div className="absolute bottom-4 left-4 text-white">
                <p>Riverside Retreat Tranquil</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-900 p-8 rounded-xl text-white flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
        <img src={i1} alt="" className="w-32 h-32 rounded-lg md:mr-8" />
        <img src={i1} alt="" className="w-32 h-32 rounded-lg" />
      </div>

      {/* Footer Section */}
      <div className="bg-gray-100 p-8 rounded-xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Explore real estate opportunities with us?
          </h1>
          <p className="text-gray-600 mt-4">
            Earum, quidem nihil eligendi voluptas laboriosam, nulla est
            excepturi voluptate laborum debitis aut suscipit cupiditate.
          </p>
        </div>
        <Separator />
        <div className="flex flex-col gap-4 md:flex-row justify-between items-start space-y-8 md:space-y-0">
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-bold">PPortal</h2>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum
              similique consectetur laboriosam explicabo iusto
            </p>
            <div className="flex gap-1">
              <Input
                type="text"
                placeholder="Enter email"
                className="flex-grow"
              />
              <Button variant="outline">Subscribe</Button>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-bold">Learn More</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>About Us</li>
              <li>Latest Items</li>
              <li>Hot Offers</li>
              <li>Popular</li>
              <li>FAQ</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-bold">Our Community</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>About Us</li>
              <li>Latest Items</li>
              <li>Hot Offers</li>
            </ul>
          </div>

          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-bold">Contact Us</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Contact Number: 123-456-7890</li>
              <li>Email Address: exm@gmail.com</li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <span>I</span>
              <span>T</span>
              <span>Y</span>
              <span>F</span>
              <span>L</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
