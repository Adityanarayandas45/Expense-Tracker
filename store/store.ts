import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import authReducer from "./authSlice";
import budgetReducer from "./budgetSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    budget: budgetReducer,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
