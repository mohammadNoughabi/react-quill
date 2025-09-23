import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <h2>React Quill MERN App</h2>
      <div className="mx-auto p-6 m-3">
        <button
          className="p-4 border-1 bg-green-600 rounded cursor-pointer"
          onClick={() => {
            navigate("/blog/create");
          }}
        >
          Create new blog
        </button>
      </div>
    </>
  );
};

export default Home;
