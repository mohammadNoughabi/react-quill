import { configureStore } from "@reduxjs/toolkit";

import blogReducer from "../store/Blogs/blogSlice";

export const store = configureStore({
  reducer: {
    blog: blogReducer,
  },
});
