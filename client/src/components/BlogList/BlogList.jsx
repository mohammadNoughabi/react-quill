import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/api";
import { removeBlog } from "../../store/Blogs/blogSlice";

const BlogList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blog.items);
  const apiBase = import.meta.env.VITE_API_BASE;
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    setDeletingId(id);
    try {
      // Changed from POST to DELETE method
      const response = await api.delete(`/api/blog/${id}`);
      alert(response.data.message);
      dispatch(removeBlog(id));
    } catch (error) {
      console.log(error);
      alert(
        "Deleting blog failed: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/blog/edit/${id}`);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header with Create Button */}
          <div className="flex justify-between items-center mb-12">
            <div className="text-center flex-1">
              <h2 className="font-bold text-5xl p-4 bg-gradient-to-r from-gray-600 to-gray-400 bg-clip-text text-transparent mb-4">
                All Blogs
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Discover our latest articles, insights, and stories
              </p>
            </div>
     
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {blogs.map((blog, index) => (
              <div
                key={blog._id || index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={`${apiBase}/uploads/${blog.mainImage}`}
                    alt={blog.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x200?text=No+Image";
                    }}
                  />
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        blog.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {blog.status || "draft"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="font-bold text-xl text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {blog.title}
                  </h3>

                  {/* Excerpt/Content Preview */}
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {blog.content?.replace(/<[^>]*>/g, "").substring(0, 100)}
                      ...
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString()
                        : "No date"}
                    </span>
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {blog.author || "Admin"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2">
                    {/* Read More Button */}
                    <button
                      onClick={() => navigate(`/blog/${blog._id}`)}
                      className="w-full cursor-pointer bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 font-medium"
                    >
                      Read More
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(blog._id)}
                      className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 font-medium"
                    >
                      Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(blog._id)}
                      disabled={deletingId === blog._id}
                      className="w-full cursor-pointer bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {deletingId === blog._id ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {blogs.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                No blogs found
              </h3>
              <p className="text-gray-500 mb-6">
                Get started by creating your first blog post!
              </p>
            </div>
          )}

          {/* Loading State for Blogs */}
          {blogs.length > 0 && (
            <div className="text-center mt-8">
              <p className="text-gray-500">
                Showing {blogs.length} blog{blogs.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogList;
