import { useState } from "react";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import axios from "axios";
import PageHeading from "./page-heading";
import SectionHeading from "./section-heading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { z } from "zod";

import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { getUserInfo } from "../lib/user-info-methods";
import { useToast } from "./ui/use-toast";

const passengerInfoSchema = z.object({
  name: z.string().min(2).max(50),
  gender: z.string(),
  cnic: z.string().min(13).max(13),
  contact_no: z.string().min(11).max(11),
  user_id: z.string(),
});

const BuyTicket = () => {
  const isAuthenticated = !!sessionStorage.getItem("email");
  if (!isAuthenticated) {
    window.location.href = "/login";
  }
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const busId = queryParams.get("bus_id");
  if (!busId) {
    window.location.href = "/";
  }

  // eslint-disable-next-line no-unused-vars
  const [bus, setBus] = useState(null);
  const [seats, setSeats] = useState(
    Array.from({ length: 40 }, (_, index) => ({
      bus_id: busId,
      passenger: null,
      seat_no: index + 1,
    }))
  );
  const [selectedSeat, setSelectedSeat] = useState(null);

  const handleSeatSelect = (e, seat) => {
    setSelectedSeat(seat);
  };

  const [passengerInfoMode, setPassengerInfoMode] = useState("default");

  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/tickets/${busId}`
      );
      console.log(response.data);
      setSeats((prevSeats) => {
        const updatedSeats = prevSeats.map((seat) => {
          const ticket = response.data.find(
            (ticket) => ticket.seat_no === seat.seat_no
          );
          if (ticket) {
            return ticket;
          }
          return seat;
        });
        return updatedSeats;
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/buses/${busId}`
        );
        setBus(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBus();
    fetchTickets();
    seats.map;
  }, []);

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(passengerInfoSchema),
    defaultValues: {
      name: "",
      cnic: "",
      contact_no: "",
      gender: "",
      user_id: "",
    },
  });

  const { toast } = useToast();

  // 2. Define a submit handler.
  async function onSubmit(values) {
    try {
      setLoading(true);
      const ticketData = {
        passengerData: values,
        user_id: sessionStorage.getItem("user_id"),
        bus_id: busId,
        seat_no: selectedSeat?.seat_no,
      };
      const response = await axios.post(
        "http://localhost:5000/tickets",
        ticketData
      );
      console.log(response.data);
      toast({
        variant: "success",
        title: "Seat Booked",
        description: "Successfully booked your seat. Safe Travels!",
      });
      fetchTickets();
      setSelectedSeat(null);
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Something went wrong. " + err.response?.data?.message,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (passengerInfoMode === "default") {
      const userInfo = getUserInfo();
      console.log(userInfo);
      form.reset({
        name: userInfo.name,
        cnic: userInfo.cnic,
        contact_no: userInfo.contact_no,
        gender: userInfo.gender,
        user_id: userInfo.user_id,
      });
    } else {
      console.log("ok");
      form.reset({
        name: "",
        cnic: "",
        contact_no: "",
        gender: "",
        user_id: "",
      });
    }
  }, [passengerInfoMode]);

  return (
    <>
      <PageHeading
        text={"Buy Ticket"}
        subtext="Choose from the available seats and provide necessary information"
      />
      <div className="flex gap-4">
        <div>
          <div className="mr-24">
            <SectionHeading text={"Choose your Seat"} />
          </div>
          <div className="grid grid-cols-4 gap-4 w-[500px] mx-auto items-center justify-center">
            {seats.map((seat) => (
              <button
                onClick={(e) => handleSeatSelect(e, seat)}
                disabled={seat.passenger}
                className={`w-8 h-8 rounded-md text-sm font-medium ${
                  seat.passenger?.gender === "M"
                    ? "bg-blue-300 text-blue-500"
                    : seat.passenger?.gender === "F"
                    ? "bg-red-300 text-red-400"
                    : selectedSeat?.seat_no === seat.seat_no
                    ? "bg-slate-400 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
                key={seat.seat_no}
              >
                {seat.passenger ? seat.passenger?.gender : seat.seat_no}
              </button>
            ))}
          </div>
          <div className="my-8 text-center mb-8 text-lg mr-24">
            <span className="text-orange-600">Chosen seat:</span>{" "}
            <span className="font-medium">
              {selectedSeat ? selectedSeat.seat_no : "No seat chosen"}
            </span>
          </div>
        </div>
        <div className="w-full">
          <SectionHeading text={"Provide Passenger Info"} />
          <div>
            <div className="flex justify-center"></div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 max-w-[500px] mx-auto"
              >
                <div className="flex gap-4 items-center">
                  <p className="text-sm">Buying Ticket for: </p>
                  <Select
                    value={passengerInfoMode}
                    defaultValue="default"
                    onValueChange={(value) => setPassengerInfoMode(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">For yourself</SelectItem>
                      <SelectItem value="custom">For someone else</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={passengerInfoMode === "default"}
                          placeholder="name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will be your Display Name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        disabled={passengerInfoMode === "default"}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="M">Male</SelectItem>
                          <SelectItem value="F">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose your gender.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cnic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNIC</FormLabel>
                      <FormControl>
                        <Input
                          disabled={passengerInfoMode === "default"}
                          placeholder="CNIC"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Your CNIC is required for buying tickets.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact No.</FormLabel>
                      <FormControl>
                        <Input
                          disabled={passengerInfoMode === "default"}
                          placeholder="Your phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your Contact Number here.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  disabled={loading}
                  variant="primary"
                  type="submit"
                  className="w-full"
                >
                  {loading ? "Booking your Ticket..." : "Book Ticket"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyTicket;
