/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import PageHeading from "./page-heading";
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
import { useToast } from "./ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SectionHeading from "./section-heading";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { cn, combineDateAndTime } from "../lib/utils";

const busSchema = z.object({
  route_id: z.string(),
  time: z.string(),
  type: z.string(),
});

const AdminPage = () => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [terminals, setTerminals] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchTerminals = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/terminals`);
        setTerminals(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchBuses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/buses`);
        console.log(response.data);
        setBuses(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchRoutes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/routes`);
        console.log(response.data);
        setRoutes(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTerminals();
    fetchBuses();
    fetchRoutes();
  }, []);

  const getTerminalCity = (id) => {
    return terminals.find((terminal) => terminal._id === id).terminal_city;
  };

  useEffect(() => {
    console.log(date);
  }, [date]);

  const busTypes = ["BASIC", "EXECUTIVE", "BUSINESS"];

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(busSchema),
    defaultValues: {
      route_id: "",
      time: "",
      type: "",
    },
  });

  const { toast } = useToast();

  // 2. Define a submit handler.
  async function onSubmit(values) {
    const departure = combineDateAndTime(date, values.time);
    const busData = {
      ...values,
      departure,
    };
    try {
      const response = await axios.post("http://localhost:5000/buses", busData);
      console.log(response.data);
      toast({
        variant: "success",
        title: "Bus Added!",
        description: "Successfully added a Bus.",
      });
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Something went wrong. " + err.response?.data?.message,
      });
    }
  }

  return (
    <>
      <PageHeading text={"Admin"} subtext="This is the Admin Portal" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-[550px] mx-auto p-8 rounded-lg border"
        >
          <SectionHeading
            text={"Add Bus"}
            className="text-orange-600 text-left"
          />
          <FormField
            control={form.control}
            name="route_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Travel Route</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Route" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {routes?.map((route) => (
                      <SelectItem key={route._id} value={route._id}>
                        <div className="flex gap-2 items-center">
                          {getTerminalCity(route.departure_terminal)}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                            />
                          </svg>
                          {getTerminalCity(route.destination_terminal)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Choose the bus route.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <FormItem className="flex flex-col">
              <FormLabel className="mb-[10px]">Pick a Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    className={""}
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Pick a Time</FormLabel>
                  <FormControl>
                    <div>
                      <input
                        className="border px-2 py-1 rounded-md w-full shadow-sm"
                        type="time"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Bus Type</FormLabel>
                <Select
                  className="w-full"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Bus Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {busTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Choose a Bus Type.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant="primary" type="submit" className="w-full">
            Add Bus
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AdminPage;
