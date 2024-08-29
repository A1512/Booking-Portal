import { createSlice } from "@reduxjs/toolkit";
// this redux reducer stores businessID
export const storePriceFilterByCustomerSlice = createSlice({
  name: "storePriceFilter",
  initialState: { value: null },
  reducers: {
    getSelectedPriceFilterValue: (state, action) => {
      // console.log('curr value', action.payload);
      return { ...state, value: action.payload };
    },
    removeSelectedPriceFilterValue: (state) => {
      // console.log('curr value', action.payload);
      return { ...state, value: null };
    },
  },
});
export const { getSelectedPriceFilterValue, removeSelectedPriceFilterValue } =
  storePriceFilterByCustomerSlice.actions; // export the action creator
export default storePriceFilterByCustomerSlice.reducer;
