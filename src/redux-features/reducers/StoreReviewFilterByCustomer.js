import { createSlice } from "@reduxjs/toolkit";
// this redux reducer stores businessID
export const storeReviewFilterByCustomerSlice = createSlice({
  name: "storeReviewFilter",
  initialState: { value: null },
  reducers: {
    getSelectedReviewFilterValue: (state, action) => {
      // console.log('curr value', action.payload);
      return { ...state, value: action.payload };
    },
    removeSelectedReviewFilterValue: (state) => {
      // console.log('curr value', action.payload);
      return { ...state, value: null };
    },
  },
});
export const { getSelectedReviewFilterValue, removeSelectedReviewFilterValue } =
  storeReviewFilterByCustomerSlice.actions; // export the action creator
export default storeReviewFilterByCustomerSlice.reducer;
