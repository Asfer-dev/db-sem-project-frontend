import { useEffect } from "react";
import { useState } from "react";
import PageHeading from "./page-heading";
import { getUserInfo } from "../lib/user-info-methods";
import axios from "axios";
import { getTimeFromDateString } from "../lib/utils";
import { Button } from "./ui/button";
import TicketCard from "./ticket-card";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userTickets, setUserTickets] = useState([]);
  const isAuthenticated = !!sessionStorage.getItem("email");
  if (!isAuthenticated) {
    window.location.href = "/login";
  }

  useEffect(() => {
    const user = getUserInfo();
    setUser(user);

    const fetchTickets = async () => {
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
    fetchTickets();
  }, []);

  return (
    <>
      <PageHeading text={"Profile"} />
      <p>{user?.email}</p>
      <p>{user?.name}</p>
      <p>{user?.CNIC}</p>
      <p>{user?.contact_no}</p>

      <div>
        {userTickets.map((ticket) => (
          <TicketCard key={ticket._id} ticket={ticket} />
        ))}
      </div>
    </>
  );
};

export default Profile;
