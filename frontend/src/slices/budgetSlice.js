import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

export const fetchBudgets = createAsyncThunk('budgets/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/budgets');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const addBudget = createAsyncThunk('budgets/add', async (payload, { rejectWithValue }) => {
  try {
    const res = await API.post('/budgets', payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateBudget = createAsyncThunk('budgets/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/budgets/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteBudget = createAsyncThunk('budgets/delete', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/budgets/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const slice = createSlice({
  name: 'budgets',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(addBudget.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.items = state.items.map(it => it._id === action.payload._id ? action.payload : it);
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.items = state.items.filter(b => b._id !== action.payload);
      });
  }
});

export default slice.reducer;
