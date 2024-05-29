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

  return (
    <>
      <PageHeading text={"Tickets"} />
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
                return { ...prev, date: addDays(new Date(), parseInt(value)) };
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

      <div>
        {buses.map((bus) => {
          return (
            <div key={bus._id}>
              <div>
                {getTerminalCity(bus.route.departure_terminal) +
                  " -> " +
                  getTerminalCity(bus.route.destination_terminal)}
              </div>
              <div>
                Departure Time: {getTimeFromDateString(bus.departure_time)}
              </div>
              <div>Type: {bus.type}</div>
              <div>Fare: Rs. {bus.route.fare + bus.addedFare}</div>
              <a href={`/buy-ticket?bus_id=${bus._id}`}>
                <Button variant="primary">Buy Ticket</Button>
              </a>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TicketsPage;
