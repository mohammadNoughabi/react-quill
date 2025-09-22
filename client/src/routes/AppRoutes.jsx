import { Route, Routes } from "react-router-dom";
import BlogRoutes from "./BlogRoutes";
import Home from "../pages/Home/Home";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog/*" element={<BlogRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
