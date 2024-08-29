import { createSlice } from "@reduxjs/toolkit";
// this redux reducer stores businessID
export const businessIDSlice = createSlice({
  name: "businessID",
  initialState: { value: 6 },
  reducers: {
    getBusinessID: (state, action) => {
      // console.log('curr value', action.payload);
      return { ...state, value: action.payload };
    },
  },
});
export const { getBusinessID } = businessIDSlice.actions; // export the action creator
export default businessIDSlice.reducer;
