import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    addBlog: (state, action) => {
      state.items = state.items.push(action.payload);
    },
    removeBlog: (state, action) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload._id
      );
    },
    updateBlog: (state, action) => {
      const item = state.items.find((item) => item._id === action.payload._id);
      const updatedItem = action.payload;
      const index = state.items.indexOf(item);
      state.items[index] = updatedItem;
    },
    setBlogs: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { addBlog, removeBlog, updateBlog, setBlogs } = blogSlice.actions;

export default blogSlice.reducer;
