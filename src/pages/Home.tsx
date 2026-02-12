import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <div className="w-full h-dvh bg-primary flex items-center justify-center">
        <div className="w-full h-[85dvh] bg-secondary rounded-tl-4xl rounded-br-4xl flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <img src={Logo} className="w-44" />
            <h1 className="font-bold text-4xl text-primary text-center m-4">
              Do it list!
            </h1>
            <svg
              className="w-9 h-9 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="#FEC288" strokeWidth="4" />
              <path
                d="M22 12a10 10 0 00-10-10"
                stroke="#FA5C5C"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
