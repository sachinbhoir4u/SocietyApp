import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Config } from '../../config/apiConfig';

export const fetchPendingBills = async (token: string) => {
  const response = await fetch(`${Config.API_BASE_URL}/payments/bills/pending`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
};

export const createPaymentOrder = async (token: string, { billId, amount }: { billId: string; amount: number }) => {
  const response = await fetch(`${Config.API_BASE_URL}/payments/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ billId, amount })
  });
  console.log("Create payment order response:", response);
  return response.json();
};

export const getPendingBills = createAsyncThunk('payments/getPendingBills', async (_, { getState }) => {
  const { users } = getState() as any;
  return fetchPendingBills(users.token);
});

export const makePayment = createAsyncThunk('payments/makePayment', async ({ billId, amount }: any, { getState }) => {
  const { users } = getState() as any;
  console.log("Auth make payment", users)
  return createPaymentOrder(users.token, { billId, amount });
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