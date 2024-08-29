import { createSlice } from "@reduxjs/toolkit";
//this redux reducer stores business services for customer
export const BusinessServicesForCustomer = createSlice({
  name: "businessServicesForCus",
  initialState: { value: null },
  reducers: {
    getBusinessServiceToShowCustomer: (state, action) => {
      // console.log('curr value', action.payload);
      return { ...state, value: action.payload };
    },
  },
});
export const { getBusinessServiceToShowCustomer } =
  BusinessServicesForCustomer.actions; // export the action creator
export default BusinessServicesForCustomer.reducer;
