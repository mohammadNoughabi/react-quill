// src/components/QuillEditor/QuillEditor.jsx
import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const QuillEditor = ({ value, onChange }) => {
  const [editorHtml, setEditorHtml] = useState(value || "");

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];

  const handleChange = (content) => {
    setEditorHtml(content);
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="border border-gray-300 rounded-2xl shadow-sm overflow-hidden">
        {/* Quill Editor */}
        <ReactQuill
          value={editorHtml}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder="Write something amazing..."
          className="h-64"
        />
      </div>
    </div>
  );
};

export default QuillEditor;
