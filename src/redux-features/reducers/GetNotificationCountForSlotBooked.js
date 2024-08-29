import { createSlice } from "@reduxjs/toolkit";
//this react reducer store notification count for business that business can identify how many notification arrived for slot confirmation.
export const GetNotificationCountForSlotBooked = createSlice({
  name: "slotNotificationCount",
  initialState: { value: 0 },
  reducers: {
    getNotificationCount: (state, action) => {
      // console.log('curr value', action.payload);
      return { ...state, value: action.payload };
    },
  },
});
export const { getNotificationCount } =
  GetNotificationCountForSlotBooked.actions; // export the action creator
export default GetNotificationCountForSlotBooked.reducer;
