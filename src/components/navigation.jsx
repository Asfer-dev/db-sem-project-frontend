import { removeUserInfo } from "../lib/user-info-methods";
import { Button } from "./ui/button";

const Navigation = () => {
  const isAuthenticated = !!sessionStorage.getItem("email");

  const handleLogout = () => {
    removeUserInfo();
    window.location.href = "/login";
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between w-full px-8 py-6 gap-4 shadow bg-orange-100">
      <nav>
        <ul className="flex items-center">
          <li className="mr-4">
            <a className="font-medium text-xl text-orange-700" href="/">
              A&A Movers
            </a>
          </li>
          <li>
            <a href="/">
              <Button variant="link">Book a Ticket</Button>
            </a>
          </li>
          <li>
            <a href="/profile">
              <Button variant="link">Profile</Button>
            </a>
          </li>
        </ul>
      </nav>
      <div className="flex">
        {isAuthenticated ? (
          <Button variant="primary" onClick={handleLogout} className="">
            Log out
          </Button>
        ) : (
          <a href="/login">
            <Button variant="primary" className="">
              Log in
            </Button>
          </a>
        )}
        <a href="/signup">
          <Button variant="link">Sign up</Button>
        </a>
      </div>
    </header>
  );
};

export default Navigation;
