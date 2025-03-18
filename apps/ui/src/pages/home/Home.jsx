import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../components/auth/Login";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("UserInfo"));

    if (user) navigate("/chat");
  }, [navigate]);

  return <Login />;
};

export default Home;
