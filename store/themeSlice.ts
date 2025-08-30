import { createSlice } from "@reduxjs/toolkit";

const initialMode =
  (typeof window !== "undefined" && (localStorage.getItem("mode") as "light" | "dark")) ||
  "light";

const slice = createSlice({
  name: "theme",
  initialState: { mode: initialMode },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
      if (typeof window !== "undefined") localStorage.setItem("mode", state.mode);
    },
    setTheme(state, action) {
      state.mode = action.payload;
      if (typeof window !== "undefined") localStorage.setItem("mode", state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = slice.actions;
export default slice.reducer;
