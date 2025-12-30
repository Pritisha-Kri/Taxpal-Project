import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { taxAPI } from '../api';

// Async thunk that calls backend tax estimate
export const calculateTaxEstimate = createAsyncThunk(
  'tax/calculate',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await taxAPI.estimate(payload);
      // backend returns data.data.calculation (based on your backend)
      return data.data.calculation || data.data || data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to calculate');
    }
  }
);

const slice = createSlice({
  name: 'tax',
  initialState: { status: 'idle', result: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(calculateTaxEstimate.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(calculateTaxEstimate.fulfilled, (s, a) => { s.status = 'succeeded'; s.result = a.payload; })
      .addCase(calculateTaxEstimate.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload || a.error.message; });
  }
});

export default slice.reducer;
