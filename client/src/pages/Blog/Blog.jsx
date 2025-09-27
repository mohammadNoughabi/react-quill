import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/api";

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiBase = import.meta.env.VITE_API_BASE;

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/blog/get-one/${id}`);
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
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600 font-medium">Loading blog post...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <div className="text-xl text-red-600 font-semibold mb-2">Error</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Blog not found state
  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-gray-400 text-4xl mb-4">📄</div>
          <div className="text-xl text-gray-700 font-semibold mb-2">Blog Not Found</div>
          <div className="text-gray-500 mb-4">The blog post you're looking for doesn't exist.</div>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Blog Content Card */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="p-8 border-b border-gray-100">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>
            
            {/* Blog Metadata */}
            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>
              {blog.author && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {blog.author}
                </span>
              )}
            </div>
          </div>

          {/* Main Image */}
          {blog.mainImage && (
            <div className="relative">
              <img
                src={`${apiBase}/uploads/${blog.mainImage}`}
                alt={blog.title}
                className="w-full h-80 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>
          )}

          {/* Content Section */}
          <div className="p-8">
            <div 
              className="prose prose-lg max-w-none 
                         prose-headings:text-gray-900
                         prose-p:text-gray-700
                         prose-li:text-gray-700
                         prose-strong:text-gray-900
                         prose-a:text-blue-600 hover:prose-a:text-blue-700
                         prose-blockquote:border-l-blue-600
                         prose-blockquote:text-gray-600
                         prose-code:text-gray-800
                         prose-pre:bg-gray-900
                         prose-img:rounded-lg
                         prose-table:border-gray-200
                         prose-th:bg-gray-50"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Posts
          </button>
          
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition duration-200"
          >
            Back to Top
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;