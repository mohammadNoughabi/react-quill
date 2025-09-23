import AppRoutes from "../../routes/AppRoutes";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../api/api";
import { setBlogs } from "../../store/Blogs/blogSlice";

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blog.items);

  const fetchBlogs = async () => {
    try {
      const response = await api.get("/api/blog/get-all");
      dispatch(setBlogs(response.data.blogs));
    } catch (error) {
      alert("Error in fetching blogs");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
    </>
  );
};

export default App;
