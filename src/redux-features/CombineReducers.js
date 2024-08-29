import { combineReducers } from "@reduxjs/toolkit";
import businessIDReducer from "./reducers/BusinessID";
import customerIDReducer from "./reducers/CustomerID";
import sidebarReducer from "./reducers/DefaultThemeSidebar";
import BusinessCardToCusByBusCat from "./reducers/BusinessCardToCusByBusCat";
import BusinessServicesForCustomer from "./reducers/BusinessServicesForCustomer";
import GetNotificationCountForSlotBooked from "./reducers/GetNotificationCountForSlotBooked";
import DisablePaymentOnPaymentSuccess from "./reducers/DisablePaymentOnPaymentSuccess";
import StorePriceFilterByCustomer from "./reducers/StorePriceFilterByCustomer";
import StoreReviewFilterByCustomer from "./reducers/StoreReviewFilterByCustomer";

// this file contain all reducer function that we can access this comnbine reducer in redux store.
const rootReducers = combineReducers({
  sidebar: sidebarReducer,
  businessID: businessIDReducer,
  customerID: customerIDReducer,
  businessCard: BusinessCardToCusByBusCat,
  businessServicesForCus: BusinessServicesForCustomer,
  slotNotificationCount: GetNotificationCountForSlotBooked,
  disablePaymentOnPaymentSuccessForCustomer: DisablePaymentOnPaymentSuccess,
  storePriceFilter: StorePriceFilterByCustomer,
  storeReviewFilter: StoreReviewFilterByCustomer,
});

export default rootReducers;
