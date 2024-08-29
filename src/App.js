import React, { Component, Suspense } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./scss/style.scss";
import PrivateRoute from "./PrivateRoute";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers

//admin panel:)
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));

const BusinessDashboardPanel = React.lazy(() =>
  import(
    "./views/pages/core-functionality/business/Business Dashboard/layout/BusinessDashboard"
  )
);

const CustomerDashboardPanel = React.lazy(() =>
  import(
    "./views/pages/core-functionality/customer/Customer Dashboard/layout/CustomerDashboard"
  )
);

// Pages
const HomePage = React.lazy(() =>
  import("./views/pages/landing-pages/HomePage")
);
const SignUpOption = React.lazy(() =>
  import("./views/pages/landing-pages/SignUpOptionPage")
);

const ForgotPassword = React.lazy(() =>
  import("./views/pages/login/ForgotPassword")
);

const AddBusinessServices = React.lazy(() =>
  import(
    "./views/pages/core-functionality/business/Business Services Page/AddBusinessServices"
  )
);

//when customer select any category then upon that category business will display
const ShowBusinessToCustomerBySelectedCategory = React.lazy(() =>
  import(
    "./views/pages/core-functionality/customer/Customer Homepage Components/ShowBusinessessCards"
  )
);

const CustomerAppointments = React.lazy(() =>
  import(
    "./views/pages/core-functionality/customer/Customer Dashboard/components/CustomerAppointments"
  )
);
//based on business user can see business services
const ShowBusinessServices = React.lazy(() =>
  import(
    "./views/pages/core-functionality/customer/Customer Homepage Components/ShowBusinessServices"
  )
);

// for implement payment interface for user there are some stripe element we've to use. that wrap our payment(card details) form.
const StripeElementWrapper = React.lazy(() =>
  import(
    "./views/pages/core-functionality/customer/Customer Dashboard/components/StripeElementWrapper"
  )
);

//customer payment list:
const CustomerPaymentList = React.lazy(() =>
  import(
    "./views/pages/core-functionality/customer/Customer Dashboard/components/CustomerPayment"
  )
);
//Authentication
const Login = React.lazy(() => import("./views/pages/login/Login"));

//Registration
// const Register = React.lazy(() => import('./views/pages/register/Register'))
const UserRegister = React.lazy(() =>
  import("./views/pages/register/UserRegister")
);
const BusinessRegister = React.lazy(() =>
  import("./views/pages/register/BusinessRegister")
);

//defualt pages
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

const App = () => {
  return (
    <>
      {/* <h1>React Posts Sharer</h1> */}
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route path="/login" name="Login Page" element={<Login />} />
            <Route path="/" name="Home Page" element={<HomePage />} />
            <Route
              path="/signup-option-page"
              name="SignUp Option Page"
              element={<SignUpOption />}
            />
            <Route
              exact
              path="/user-register"
              name="Register Page"
              element={<UserRegister />}
            />
            <Route
              exact
              path="/business-register"
              name="Register Page"
              element={<BusinessRegister />}
            />
            <Route
              exact
              path="/forgot-password"
              name="Forgot Password Page"
              element={<ForgotPassword />}
            />

            {/* <Route
              path="/add-business-services"
              element={<AddBusinessServices />}
            /> */}

            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route
              path="/admin/*"
              name="Admin Page"
              element={<DefaultLayout />}
            />
            <Route
              path="/business-owner/*"
              name="Business Dashboard"
              element={
                <PrivateRoute>
                  <BusinessDashboardPanel />
                </PrivateRoute>
              }
            />

            <Route
              path="/customer-dashboard/*"
              element={
                <PrivateRoute>
                  <CustomerDashboardPanel />
                </PrivateRoute>
              }
            />
            {/* <Route
              path="/customer-dashboard/homepage/show-businesses"
              name="Customer Dashboard"
              element={
                <PrivateRoute>
                  <ShowBusinessToCustomerBySelectedCategory />
                </PrivateRoute>
              }
            /> */}
            {/* <Route
              path="/customer-dashboard/homepage/business-services"
              name="Customer Dashboard"
              element={
                <PrivateRoute>
                  <ShowBusinessServices />
                </PrivateRoute>
              }
            /> */}
            {/* <Route
              path="/customer-dashboard/homepage/booked-appointments"
              name="Customer Dashboard/Appointments"
              element={
                <PrivateRoute>
                  <CustomerAppointments />
                </PrivateRoute>
              }
            /> */}
            {/* <Route
              path="/slot-booked/customer-payment"
              name="Payment"
              element={
                <PrivateRoute>
                  <StripeElementWrapper />
                </PrivateRoute>
              }
            /> */}
            {/* <Route
              path="/customer-dashboard/homepage/customer/payment-list"
              name="Customer/Payment List"
              element={
                <PrivateRoute>
                  <CustomerPaymentList />
                </PrivateRoute>
              }
            /> */}
            <Route path="*" name="Page Not Found" element={<Page404 />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </>
  );
};

export default App;
