import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

// ======================= ASYNC THUNKS =======================

// ✅ Fetch all transactions
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/transactions");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch transactions");
    }
  }
);

// ✅ Add new transaction (income or expense)
export const addTransaction = createAsyncThunk(
  "transactions/add",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.post("/transactions", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add transaction");
    }
  }
);

// ✅ Delete a transaction
export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/transactions/${id}`);
      return id; // Return deleted transaction id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete transaction");
    }
  }
);

// ======================= INITIAL STATE =======================
const initialState = {
  items: [],
  totals: { income: 0, expense: 0, balance: 0 },
  loading: false,
  error: null,
};

// ======================= SLICE =======================
const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;

        // ✅ Recalculate totals dynamically
        let income = 0,
          expense = 0;
        action.payload.forEach((t) => {
          if (t.type === "income") income += t.amount;
          else expense += t.amount;
        });
        state.totals = {
          income,
          expense,
          balance: income - expense,
        };
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add transaction
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.items.unshift(action.payload);

        // ✅ Update totals immediately
        if (action.payload.type === "income")
          state.totals.income += action.payload.amount;
        else state.totals.expense += action.payload.amount;

        state.totals.balance =
          state.totals.income - state.totals.expense;
      })

      // Delete transaction
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        const id = action.payload;
        const removed = state.items.find((t) => t._id === id);

        if (removed) {
          // ✅ Update totals after deletion
          if (removed.type === "income")
            state.totals.income -= removed.amount;
          else state.totals.expense -= removed.amount;

          state.totals.balance =
            state.totals.income - state.totals.expense;
        }

        // Remove from array
        state.items = state.items.filter((t) => t._id !== id);
      });
  },
});

export default transactionsSlice.reducer;
