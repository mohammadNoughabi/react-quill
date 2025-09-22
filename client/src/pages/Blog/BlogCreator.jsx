import QuillEditor from "../../components/QuillEditor/QuillEditor";
import { useState } from "react";

const BlogCreator = () => {
  const [data, setData] = useState({
    title: "",
    mainImage: "",
    content: "",
    contentImages: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.title || !data.mainImage) {
      alert("Title and Main image are required for creating new blog");
    } else {
      let formData = new FormData();
      formData.append("title", data.title);
      formData.append("mainImage", data.mainImage);
      formData.append("content", data.content);
      formData.append("contentImages", data.contentImages);
    }
  };

  return (
    <>
      <h2>Blog Creator</h2>
      <div className="d-flex flex-col m-3 p-4">
        <form onSubmit={handleSubmit}></form>
      </div>
    </>
  );
};

export default BlogCreator;
