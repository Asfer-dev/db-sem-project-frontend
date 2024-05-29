import { useEffect } from "react";
import { useState } from "react";
import PageHeading from "./page-heading";
import { getUserInfo } from "../lib/user-info-methods";
import axios from "axios";
import TicketCard from "./ticket-card";
import SectionHeading from "./section-heading";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userTickets, setUserTickets] = useState([]);
  const isAuthenticated = !!sessionStorage.getItem("email");
  if (!isAuthenticated) {
    window.location.href = "/login";
  }

  const fetchTickets = async () => {
    const user = getUserInfo();
    try {
      const response = await axios.get(
        `http://localhost:5000/tickets?user_id=${user.user_id}`
      );
      console.log(response.data);
      setUserTickets(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const user = getUserInfo();
    setUser(user);

    fetchTickets();
  }, []);

  return (
    <>
      <PageHeading text={"Profile"} />
      <section className="py-8 border-b border-t flex flex-col items-center">
        <SectionHeading text={"Account Information"} />
        <div>
          <p>
            <span className="font-medium">E-mail: </span>
            {user?.email}
          </p>
          <p>
            <span className="font-medium">Full Name: </span>
            {user?.name}
          </p>
          <p>
            <span className="font-medium">Gender: </span>
            {user?.gender}
          </p>
          <p>
            <span className="font-medium">CNIC: </span>
            {user?.cnic}
          </p>
          <p>
            <span className="font-medium">Contact No: </span>
            {user?.contact_no}
          </p>
        </div>
      </section>

      <section className="mt-8">
        <SectionHeading text={"My Booked Tickets"} />
        <div className="grid-cols-2 gap-4 grid">
          {userTickets.map((ticket) => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              fetchTickets={fetchTickets}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default Profile;
