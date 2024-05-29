import { useState } from "react";
import PageHeading from "./page-heading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useEffect } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "./ui/calendar";
import { addDays, format } from "date-fns";
import { cn, getTimeFromDateString } from "../lib/utils";
// import { IconArrowRight } from "../lib/icons";

const TicketsPage = () => {
  const [terminals, setTerminals] = useState([]);
  const [buses, setBuses] = useState([]);
  const [filters, setFilters] = useState({
    departTerminal: "",
    destTerminal: "",
    date: null,
  });

  const fetchBuses = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/buses`);
      console.log(response.data);
      setBuses(response.data);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchTerminals = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/terminals`);
        setTerminals(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTerminals();
    fetchBuses();
  }, []);

  const getTerminalCity = (id) => {
    return terminals.find((terminal) => terminal._id === id).terminal_city;
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/buses`).then((response) => {
      setBuses(
        response.data.filter((bus) => {
          let sameDate = true;
          let sameDepart = true;
          let sameDest = true;
          if (filters.departTerminal !== "")
            sameDepart =
              bus.route.departure_terminal === filters.departTerminal;
          if (filters.destTerminal !== "")
            sameDest = bus.route.destination_terminal === filters.destTerminal;
          if (filters.date) {
            sameDate =
              new Date(bus.departure_time).getDate() === filters.date.getDate();
          }
          return sameDate && sameDepart && sameDest;
        })
      );
    });
  }, [filters]);

  const infoTextStyles = "text-sm text-orange-600";

  return (
    <>
      <PageHeading
        text={"Available Buses"}
        subtext="Choose from the available buses and book your ticket"
      />
      <div className="flex gap-4 justify-between items-center p-2 mb-4">
        <h3 className="text-md">Filters: </h3>
        <div className="flex gap-4">
          <Select
            value={filters.departTerminal}
            onValueChange={(value) =>
              setFilters((prev) => {
                return { ...prev, departTerminal: value };
              })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Departure City" />
            </SelectTrigger>
            <SelectContent>
              {terminals?.map((terminal) => (
                <SelectItem key={terminal._id} value={terminal._id}>
                  {terminal.terminal_city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.destTerminal}
            onValueChange={(value) =>
              setFilters((prev) => {
                return { ...prev, destTerminal: value };
              })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Destination City" />
            </SelectTrigger>
            <SelectContent>
              {terminals?.map((terminal) => (
                <SelectItem key={terminal._id} value={terminal._id}>
                  {terminal.terminal_city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* DATE */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !filters.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date ? (
                  format(filters.date, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="flex w-auto flex-col space-y-2 p-2"
            >
              <Select
                onValueChange={(value) =>
                  setFilters((prev) => {
                    return {
                      ...prev,
                      date: addDays(new Date(), parseInt(value)),
                    };
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="0">Today</SelectItem>
                  <SelectItem value="1">Tomorrow</SelectItem>
                  <SelectItem value="3">In 3 days</SelectItem>
                  <SelectItem value="7">In a week</SelectItem>
                </SelectContent>
              </Select>
              <div className="rounded-md border">
                <Calendar
                  mode="single"
                  selected={filters.date}
                  onSelect={(e) =>
                    setFilters((prev) => {
                      return { ...prev, date: e };
                    })
                  }
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {buses.map((bus) => {
          return (
            <div
              key={bus._id}
              className="rounded-lg p-3 px-4 border shadow flex gap-4"
            >
              <img
                src="../../public/bus.jpg"
                className="h-[150px]"
                alt="bus-image"
              />
              <div className="w-full flex flex-col justify-between">
                <div>
                  <div className="flex gap-2 items-center">
                    <span className={infoTextStyles}>Route:</span>{" "}
                    {getTerminalCity(bus.route.departure_terminal)}
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
                    {getTerminalCity(bus.route.destination_terminal)}
                  </div>
                  <div>
                    <span className={infoTextStyles}>Departure Time:</span>{" "}
                    {getTimeFromDateString(bus.departure_time)}
                  </div>
                  <div>
                    <span className={infoTextStyles}>Type:</span> {bus.type}
                  </div>
                  <div>
                    <span
                      className={infoTextStyles + " text-sky-600 font-medium"}
                    >
                      Fare:
                    </span>{" "}
                    <span className="font-medium text-gray-700">
                      Rs. {bus.route.fare + bus.addedFare}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <a href={`/buy-ticket?bus_id=${bus._id}`}>
                    <Button variant="primary">Book Ticket</Button>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TicketsPage;
