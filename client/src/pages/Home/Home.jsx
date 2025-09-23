import { useNavigate } from "react-router-dom";
import BlogList from "../../components/BlogList/BlogList";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <h2 className="font-bold m-4 p-2 text-capitalize text-lg-center text-6xl">
        React Quill MERN App
      </h2>
      <div className="mx-auto p-6 m-3">
        <button
          className="p-4 border-1 text-2xl bg-green-600 rounded cursor-pointer"
          onClick={() => {
            navigate("/blog/create");
          }}
        >
          Create new blog
        </button>
      </div>
      <BlogList />
    </>
  );
};

export default Home;
