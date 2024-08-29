import { createSlice } from "@reduxjs/toolkit";
// this react reducer store payment status reject or done, so that customer can't payment again.
export const DisablePaymentOnPaymentSuccess = createSlice({
  name: "disablePaymentOnPaymentSuccessForCustomer",
  initialState: { value: false },
  reducers: {
    disablePaymentOnSuccess: (state, action) => {
      // console.log('curr value', action.payload);
      return { ...state, value: action.payload };
    },
  },
});
export const { disablePaymentOnSuccess } =
  DisablePaymentOnPaymentSuccess.actions; // export the action creator
export default DisablePaymentOnPaymentSuccess.reducer;
