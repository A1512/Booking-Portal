import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";

//this component wrap payment component..
//Element(Element Provider) Tag allows to use components which is for payment form.
const StripeElementWrapper = () => {
  // when you toggle to live mode, you should add the live publishale key.
  const stripePromise = loadStripe(
    "pk_test_51Ou7hVSHWJzx2Qu47FtfS6dng33RjykHuURRp1DfDUXlwRAvz5quGzpWRlXQII9RnW8tD3wrIRWCkpnZGhOC9l1h00yV7OnZcb"
  );
  return (
    <>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </>
  );
};

export default StripeElementWrapper;
