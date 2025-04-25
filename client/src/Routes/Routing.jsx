import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "../Components/Navbar/Navbar";
import Login from "../Pages/auth/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import { ToastContainer } from "react-toastify";

const Routing = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigation = useNavigate();

  // console.log(isAuthenticated, user);

  const [isAuth, setIsAuth] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    localStorage.getItem("accessToken") ? setIsAuth(true) : setIsAuth(false);

    if (!isAuthenticated && !localStorage.getItem("accessToken")) {
      navigation("/login");
    }
  }, [navigation, isAuth, isAuthenticated]);

  return (
    <>
      {isAuth ? (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          <Box component="main" sx={{ flexGrow: 2, p: 3 }}>
            <Navbar onOpen={handleSidebarToggle} />
            <Box>
              <Routes>
                <Route element={<ProtectedRoute isAuthenticated={isAuth} />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="*" element={() => <h1>404 Page Not Found</h1>} />
                </Route>
              </Routes>
            </Box>
          </Box>
        </Box>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
      <ToastContainer />
    </>
  );
};

export default Routing;
