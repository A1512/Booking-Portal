import { createSlice } from "@reduxjs/toolkit";
// this redux reducer stores business list for customer, when customer click on any business categories.
export const BusinessCardToCusByBusCat = createSlice({
  name: "businessCard",
  initialState: { value: null },
  reducers: {
    getBusinessessToShowCustomer: (state, action) => {
      // console.log('curr value', action.payload);
      return { ...state, value: action.payload };
    },
  },
});
export const { getBusinessessToShowCustomer } =
  BusinessCardToCusByBusCat.actions; // export the action creator
export default BusinessCardToCusByBusCat.reducer;
