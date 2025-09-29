import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { fetchPendingBills, createPaymentOrder } from '../../api/payments';
import { Config } from '../../config/apiConfig';

export const fetchPendingBills = async (token: string) => {
  const response = await fetch(`${Config.API_BASE_URL}/api/payments/bills/pending`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
};

export const createPaymentOrder = async (token: string, { billId, amount }: { billId: string; amount: number }) => {
  const response = await fetch(`${Config.API_BASE_URL}/api/payments/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ billId, amount })
  });
  return response.json();
};

export const getPendingBills = createAsyncThunk('payments/getPendingBills', async (_, { getState }) => {
  const { auth } = getState() as any;
  return fetchPendingBills(auth.token);
});

export const makePayment = createAsyncThunk('payments/makePayment', async ({ billId, amount }: any, { getState }) => {
  const { auth } = getState() as any;
  return createPaymentOrder(auth.token, { billId, amount });
});

const paymentSlice = createSlice({
  name: 'payments',
  initialState: { bills: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPendingBills.fulfilled, (state, action) => {
      state.bills = action.payload.bills;
      state.loading = false;
    });
  }
});

export default paymentSlice.reducer;