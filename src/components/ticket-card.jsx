/* eslint-disable react/prop-types */
import { getTimeFromDateString } from "../lib/utils";
import { Button } from "./ui/button";
import axios from "axios";
import { useToast } from "./ui/use-toast";

const TicketCard = ({ ticket }) => {
  const { toast } = useToast();
  const handleTicketDelete = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/tickets/" + ticket._id
      );
      if (response.status == 200) {
        toast({
          title: "Cancelled",
          description: "Ticked successfully Cancelled",
        });
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

  return (
    <div className="rounded-lg border p-4">
      <div>
        <h3>Bus Info</h3>
        <div>
          {ticket.bus.route.departure_terminal.terminal_city +
            " -> " +
            ticket.bus.route.destination_terminal.terminal_city}
        </div>
        <div>
          Departure Time: {getTimeFromDateString(ticket.bus.departure_time)}
        </div>
        <div>Type: {ticket.bus.type}</div>
        <div>Fare: Rs. {ticket.bus.route.fare + ticket.bus.addedFare}</div>
      </div>
      <div>
        <h3>Passenger Info</h3>
        <div>Full Name: {ticket.passenger.name}</div>
      </div>
      <Button onClick={handleTicketDelete} variant="destructive">
        Cancel Ticket
      </Button>
    </div>
  );
};

export default TicketCard;
