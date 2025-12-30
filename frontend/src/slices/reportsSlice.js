import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { reportsAPI } from '../api';

export const fetchReports = createAsyncThunk('reports/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await reportsAPI.getAll();
    return res.data || res; // assume { data: [...] }
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch reports');
  }
});

export const generateReport = createAsyncThunk('reports/generate', async (params, { rejectWithValue }) => {
  try {
    const res = await reportsAPI.generate(params);
    return res.data || res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to generate report');
  }
});

const slice = createSlice({
  name: 'reports',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (s) => { s.status = 'loading'; })
      .addCase(fetchReports.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = a.payload.reports || a.payload || []; })
      .addCase(fetchReports.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload || a.error.message; })

      .addCase(generateReport.pending, (s) => { s.status = 'loading'; })
      .addCase(generateReport.fulfilled, (s) => { s.status = 'succeeded'; })
      .addCase(generateReport.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload || a.error.message; });
  }
});

export default slice.reducer;
