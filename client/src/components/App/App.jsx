import AppRoutes from "../../routes/AppRoutes";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../api/api";
import { setBlogs } from "../../store/Blogs/blogSlice";

const App = () => {
  const blogs = useSelector((state) => state.blog.items);

  const fetchBlogs = async () => {
    try {
      const response = await api.get("/api/blog/get-all");
      if (response.ok) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      alert("Error in fetching blogs");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [blogs]);

  return (
    <>
      <AppRoutes />
    </>
  );
};

export default App;
