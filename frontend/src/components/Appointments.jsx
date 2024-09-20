import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import {
  Calendar,
  CircleCheckBig,
  MessageSquareText,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Appointments() {
  const { user, authToken } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    description: "",
    date: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/appointment/list`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );
        setAppointments(response.data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    fetchAppointments();
  }, [authToken]);

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setEditData({
      description: appointment.description,
      date: appointment.date.split("T")[0], // Format date for input
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointment/update/${selectedAppointment.id}`,
        {
          description: editData.description,
          date: editData.date,
        },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      // Update the appointments state with the new data
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === selectedAppointment.id
            ? { ...appointment, ...response.data }
            : appointment
        )
      );
      toast.success("Appointment updated successfully");
      setEditDialogOpen(false);
      navigate(0);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update appointment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointment/delete/${selectedAppointment.id}`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.filter(
          (appointment) => appointment.id !== selectedAppointment.id
        )
      );
      toast.success("Appointment deleted successfully");
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete appointment");
    } finally {
      setIsLoading(false);
    }
  };

  const isCompleted = (date) => date.getTime() >= new Date().getTime();

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="w-full sm:w-9/12">
        <h1 className="mr-auto text-3xl font-bold text-primary">
          Appointments
        </h1>
      </div>
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="w-full sm:w-9/12">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">
              {appointment.property.title}
            </CardTitle>
            <CardDescription>
              {appointment.property.local_address}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {user.role === "agent" && (
              <p className="flex items-center gap-2">
                <User size={20} />
                <span>{appointment.customer.user.name}</span>
              </p>
            )}
            <p className="flex items-center gap-2">
              <Calendar size={20} />
              <span>{new Date(appointment.date).toLocaleDateString()}</span>
            </p>
            <p className="flex items-center gap-2">
              <MessageSquareText size={20} />
              <span>{appointment.description}</span>
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            {isCompleted(new Date(appointment.date)) ? (
              // <p className="text-sm text-white bg-purple-600 px-2 py-1 rounded-md">
              //   Completed
              // </p>
              <p className="flex items-center gap-2">
                <CircleCheckBig size={20} />
                <span>Completed</span>
              </p>
            ) : (
              <>
                <Button
                  className="w-full sm:w-fit"
                  onClick={() => handleEditClick(appointment)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="w-full sm:w-fit"
                  onClick={() => handleDeleteClick(appointment)}
                >
                  Delete
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      ))}

      {/* Edit Appointment Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Edit the date and description of your appointment.
          </DialogDescription>
          <div className="space-y-4">
            <Input
              type="date"
              value={editData.date}
              onChange={(e) =>
                setEditData({ ...editData, date: e.target.value })
              }
            />
            <Input
              type="text"
              value={editData.description}
              placeholder="Enter new description"
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
            />
          </div>
          <DialogFooter className="flex justify-between flex-wrap gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Appointment Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Appointment</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this appointment?
          </DialogDescription>
          <DialogFooter className="flex justify-between flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Appointments;
