import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchBlogs = createAsyncThunk("/blog/fetchBlogs", async () => {
  const response = await api.get("/api/blog/get-all");
  return response.data.blogs;
});

const initialState = {
  blogs: [],
  error: null,
  status: "idle",
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    addBlog: (state, action) => {
      state.blogs = state.blogs.push(action.payload);
    },
    removeBlog: (state, action) => {
      state.blogs = state.blogs.filter((item) => item._id !== action.payload);
    },
    updateBlog: (state, action) => {
      const item = state.blogs.find((item) => item._id === action.payload._id);
      const updatedItem = action.payload;
      const index = state.blogs.indexOf(item);
      state.blogs[index] = updatedItem;
    },
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBlogs.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchBlogs.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.blogs = action.payload;
    });
    builder.addCase(fetchBlogs.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
  },
});

export const { addBlog, removeBlog, updateBlog, setBlogs } = blogSlice.actions;

export default blogSlice.reducer;
