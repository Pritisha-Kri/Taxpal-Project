import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import budgetReducer from './slices/budgetSlice';
import transactionsReducer from './slices/transactionsSlice';
import taxReducer from './slices/taxSlice';
import reportsReducer from './slices/reportsSlice';
import taxCalendarReducer from "./slices/taxCalendarSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    budgets: budgetReducer,
    transactions: transactionsReducer,
    tax: taxReducer,
    reports: reportsReducer,
    taxCalendar: taxCalendarReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
