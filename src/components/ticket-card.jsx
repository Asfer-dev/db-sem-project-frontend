/* eslint-disable react/prop-types */
import { getTimeFromDateString } from "../lib/utils";
import { Button } from "./ui/button";
import axios from "axios";
import { useToast } from "./ui/use-toast";

const TicketCard = ({ ticket, fetchTickets }) => {
  const { toast } = useToast();
  const handleTicketDelete = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/tickets/" + ticket._id
      );
      if (response.status == 200) {
        toast({
          variant: "warning",
          title: "Cancelled",
          description: "Ticked successfully Cancelled",
        });
        fetchTickets();
      } else {
        toast({
          variant: "destructive",
          title: "Oops!",
          description: "Something went wrong.",
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Something went wrong. ",
      });
    }
  };
  const infoTextStyles = "text-sm text-orange-600";

  return (
    <div className="rounded-lg border p-4 text-sm">
      <div className="flex gap-16">
        <div>
          <h3 className="font-medium mb-2">Bus Info</h3>
          <div className="flex gap-2 items-center">
            <span className={infoTextStyles}>Route:</span>{" "}
            {ticket.bus.route.departure_terminal.terminal_city}
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
            {ticket.bus.route.destination_terminal.terminal_city}
          </div>
          <div>
            <span className={infoTextStyles}>Departure Time:</span>{" "}
            {getTimeFromDateString(ticket.bus.departure_time)}
          </div>
          <div>
            <span className={infoTextStyles}>Type:</span> {ticket.bus.type}
          </div>
          <div>
            <span className={infoTextStyles + " text-sky-600 font-medium"}>
              Fare:
            </span>{" "}
            <span className="font-medium text-gray-700">
              Rs. {ticket.bus.route.fare + ticket.bus.addedFare}
            </span>
          </div>
        </div>
        <div className="border-l pl-8">
          <h3 className="font-medium mb-2">Passenger Info</h3>
          <div>
            <span className={infoTextStyles}>Full Name: </span>
            {ticket.passenger.name}
          </div>
          <div>
            <span className={infoTextStyles}>Gender: </span>
            {ticket.passenger.gender}
          </div>
          <div>
            <span className={infoTextStyles}>CNIC: </span>
            {ticket.passenger.cnic}
          </div>
          <div>
            <span className={infoTextStyles}>Contact: </span>
            {ticket.passenger.contact_no}
          </div>
        </div>
      </div>
      <div className="flex">
        <Button
          size="sm"
          className="mt-3"
          onClick={handleTicketDelete}
          variant="destructive"
        >
          Cancel Ticket
        </Button>
      </div>
    </div>
  );
};

export default TicketCard;
