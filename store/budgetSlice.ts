import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BudgetState {
  selectedMonth: string;
}

const initialState: BudgetState = {
  selectedMonth: new Date().toISOString().slice(0, 7), 
};

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    setSelectedMonth(state, action: PayloadAction<string>) {
      state.selectedMonth = action.payload;
    },
  },
});

export const { setSelectedMonth } = budgetSlice.actions;
export default budgetSlice.reducer;
