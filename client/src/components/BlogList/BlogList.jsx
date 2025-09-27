import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/api";
import { removeBlog, fetchBlogs } from "../../store/Blogs/blogSlice";

const BlogList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blogs, status, error } = useSelector((state) => state?.blog);
  const apiBase = import.meta.env.VITE_API_BASE;
  const [deletingId, setDeletingId] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBlogs());
    }
  }, [status, dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await api.delete(`/api/blog/${id}`);
      alert(response?.data?.message);
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

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  {
    blogs.length === 0 && (
      <div className="text-center py-20">
        <h3 className="text-3xl font-bold text-gray-600 mb-3">No blogs yet</h3>
        ...
      </div>
    );
  }

  // Sort blogs based on selection
  const sortedBlogs = [...blogs].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 p-1 rounded-2xl mb-6">
            <div className="bg-white rounded-xl px-6 py-2">
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BLOG COLLECTION
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent mb-4">
            Explore Our Blogs
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Dive into our collection of insightful articles, stories, and expert
            perspectives
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <span className="text-gray-600 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-200"></div>
            </div>
            <span className="text-sm font-medium">
              {blogs.length} blog{blogs.length !== 1 ? "s" : ""} available
            </span>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {sortedBlogs?.map((blog, index) => (
            <div
              key={blog._id || index}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden"
            >
              {/* Image Container with Gradient Overlay */}
              <div className="relative overflow-hidden h-56">
                <img
                  src={`${apiBase}/uploads/${blog.mainImage}`}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category Tag */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                    Article
                  </span>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-gray-500 text-sm">
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "No date"}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-xl text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                  {blog.title}
                </h3>

                {/* Excerpt */}
                <div className="mb-4">
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {blog.content?.replace(/<[^>]*>/g, "").substring(0, 120)}
                    {blog.content?.replace(/<[^>]*>/g, "").length > 120
                      ? "..."
                      : ""}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {(blog.author || "A")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {blog.author || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500">Author</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {/* Read More */}
                  <button
                    onClick={() => navigate(`/blog/${blog._id}`)}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 transform hover:scale-105 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Read
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(blog._id)}
                    className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    title="Edit Blog"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(blog._id)}
                    disabled={deletingId === blog._id}
                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Blog"
                  >
                    {deletingId === blog._id ? (
                      <svg
                        className="animate-spin w-5 h-5"
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
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {blogs.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-600 mb-3">
              No blogs yet
            </h3>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              Start your blogging journey by creating your first amazing post!
            </p>
            <button
              onClick={() => navigate("/blog/create")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
            >
              Create First Blog
            </button>
          </div>
        )}

        {/* Footer Stats */}
        {blogs.length > 0 && (
          <div className="text-center mt-12 pt-8 border-t border-gray-200/50">
            <p className="text-gray-500 text-sm">
              Showing {blogs.length} blog{blogs.length !== 1 ? "s" : ""} •
              Sorted by{" "}
              {sortBy
                .replace("newest", "newest first")
                .replace("oldest", "oldest first")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
