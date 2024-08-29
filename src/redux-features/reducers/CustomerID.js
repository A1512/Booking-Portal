import { createSlice } from "@reduxjs/toolkit";
// this redux reducer stores customerID
export const customerIDSlice = createSlice({
  name: "customerID",
  initialState: { value: 17 },
  reducers: {
    getCustomerID: (state, action) => {
      //   console.log('curr value', action.payload);
      return { ...state, value: action.payload };
    },
  },
});
export const { getCustomerID } = customerIDSlice.actions; // export the action creator
export default customerIDSlice.reducer;
