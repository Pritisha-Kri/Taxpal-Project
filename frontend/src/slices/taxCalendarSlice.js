import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { taxCalendarAPI } from "../api";

export const fetchTaxCalendar = createAsyncThunk(
  "taxCalendar/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await taxCalendarAPI.getCalendar();
      return res.data.calendar;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load tax calendar");
    }
  }
);

const slice = createSlice({
  name: "taxCalendar",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchTaxCalendar.pending, (s) => {
      s.status = "loading";
    });
    b.addCase(fetchTaxCalendar.fulfilled, (s, a) => {
      s.status = "succeeded";
      s.items = a.payload;
    });
    b.addCase(fetchTaxCalendar.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload;
    });
  },
});

export default slice.reducer;
