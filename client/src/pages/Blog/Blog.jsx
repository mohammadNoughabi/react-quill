import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/api";

const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiBase = import.meta.env.VITE_API_BASE;

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/blog/get-one/${id}`);
      console.log(response);
      setBlog(response.data.blog);
    } catch (error) {
      console.log(error);
      setError("Error in fetching blog");
      alert("Error in fetching blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]); // Added id as dependency

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  // Blog not found state
  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Blog not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      
      {blog.mainImage && (
        <img 
          src={`${apiBase}/uploads/${blog.mainImage}`} 
          alt={blog.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}
      
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }} 
      />
    </div>
  );
};

export default Blog;