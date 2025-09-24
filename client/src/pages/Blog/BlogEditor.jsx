import { useState, useEffect, useRef, useCallback } from "react";
import debounce from "lodash/debounce";
import api from "../../api/api";
import QuillEditor from "../../components/QuillEditor/QuillEditor";
import { useNavigate, useParams } from "react-router-dom";
import { updateBlog } from "../../store/Blogs/blogSlice";
import { useDispatch } from "react-redux";

// Utility function to convert base64 to File
const convertDataUrlToFile = (dataUrl, filename) => {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// Utility function to extract images from Quill content
const extractImagesFromContent = (content) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const images = doc.querySelectorAll("img");
  const imageFiles = [];

  images.forEach((img, index) => {
    const src = img.getAttribute("src");
    if (src && src.startsWith("data:image/")) {
      const filename = `content-image-${index + 1}.${
        src.split(";")[0].split("/")[1]
      }`;
      const file = convertDataUrlToFile(src, filename);
      if (file.size > 5 * 1024 * 1024) {
        return;
      }
      imageFiles.push(file);
    }
  });

  return imageFiles;
};

const BlogEditor = () => {
  const { id } = useParams();
  const [data, setData] = useState({
    title: "",
    mainImage: null,
    content: "",
  });
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiBase = import.meta.env.VITE_API_BASE;

  // Fetch blog data on mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/api/blog/get-one/${id}`);
        const blog = response.data.blog;
        setData({
          title: blog.title,
          mainImage: null, // File input starts empty; existing image handled via previewUrl
          content: blog.content,
        });
        setPreviewUrl(blog.mainImage); // Assume mainImage is a URL or path
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        alert("Failed to load blog data");
        navigate("/");
      }
    };
    fetchBlog();
  }, [id, navigate]);

  // Handle input changes
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  // Handle file changes
  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          setErrors((prev) => ({
            ...prev,
            mainImage: "Please select an image file",
          }));
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            mainImage: "File size must be less than 5MB",
          }));
          return;
        }
        setData((prev) => ({
          ...prev,
          mainImage: file,
        }));
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        if (errors.mainImage) {
          setErrors((prev) => ({
            ...prev,
            mainImage: "",
          }));
        }
      }
    },
    [errors.mainImage]
  );

  // Handle content changes from Quill
  const handleContentChange = useCallback(
    debounce((content) => {
      setData((prev) => ({
        ...prev,
        content: content,
      }));
      if (errors.content) {
        setErrors((prev) => ({
          ...prev,
          content: "",
        }));
      }
    }, 300),
    [errors.content]
  );

  const handleSelectImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!data.title.trim()) {
      newErrors.title = "Title is required";
    } else if (data.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters long";
    }
    if (!data.content.trim() || data.content === "<p><br></p>") {
      newErrors.content = "Content is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [data]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", data.title.trim());
    formData.append("content", data.content);
    if (data.mainImage) {
      formData.append("mainImage", data.mainImage);
    }
    const contentImages = extractImagesFromContent(data.content);
    if (contentImages.length === 0 && data.content.includes("<img")) {
      setErrors((prev) => ({
        ...prev,
        content: "Content images are too large or invalid",
      }));
      return;
    }
    contentImages.forEach((image) => {
      formData.append("contentImages", image);
    });

    try {
      const response = await api.put(`/api/blog/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(updateBlog(response.data.updatedBlog));
      alert(response.data.message || "Blog updated successfully!");
      navigate(`/blog/${id}`);
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Error in updating blog: " + error.message);
    }
  };

  const clearPreview = useCallback(() => {
    if (previewUrl && data.mainImage) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(data.mainImage ? previewUrl : "");
    setData((prev) => ({ ...prev, mainImage: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl, data.mainImage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading blog data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <button
        onClick={() => navigate('/')}
        className="m-8 p-4 text-secondary bg-red-500 cursor-pointer rounded border-1 text-2xl"
      >
        Back to Home
      </button>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Edit Blog Post
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Blog Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={data.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter blog title..."
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Main Image Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Image *
                </label>
                {!data.mainImage && !previewUrl ? (
                  <div
                    onClick={handleSelectImage}
                    className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-gray-600">
                        Click to select main image
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PNG, JPG, JPEG up to 5MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="border border-gray-300 rounded-md p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-green-600 font-medium">
                          ✓{" "}
                          {data.mainImage
                            ? data.mainImage.name
                            : "Current Image"}
                        </span>
                        <button
                          type="button"
                          onClick={clearPreview}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                      <img
                        src={`${apiBase}/uploads/${previewUrl}`}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded"
                      />
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  id="mainImageInput"
                  name="mainImage"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                {errors.mainImage && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.mainImage}
                  </p>
                )}
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <QuillEditor
                  value={data.content}
                  onChange={handleContentChange}
                  placeholder="Edit your blog content..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Update Blog Post
              </button>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Live Preview
            </h3>
            <div className="space-y-4">
              {data.title ? (
                <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                  {data.title}
                </h2>
              ) : (
                <div className="text-gray-400 italic">No title yet</div>
              )}
              {previewUrl ? (
                <img
                  src={`${apiBase}/uploads/${previewUrl}`}
                  alt="Main Preview"
                  className="w-full h-64 object-cover rounded-lg shadow"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No image selected</span>
                </div>
              )}
              <div className="prose max-w-none">
                {data.content && data.content !== "<p><br></p>" ? (
                  <div dangerouslySetInnerHTML={{ __html: data.content }} />
                ) : (
                  <div className="text-gray-400 italic p-4 bg-gray-50 rounded">
                    Content will appear here as you type...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
