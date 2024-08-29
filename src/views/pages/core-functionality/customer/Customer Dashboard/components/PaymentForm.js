import React, { useState } from "react";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import {
  CButton,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CInputGroup,
  CCard,
  CRow,
  CInputGroupText,
  CCardHeader,
  CToast,
  CToastHeader,
  CToastBody,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";

//this component display payform to user who wants to make payment online.
const PaymentForm = () => {
  //The useStripe hook returns a reference to the Stripe instance passed to the Elements provider.
  const stripe = useStripe();

  //To safely pass the payment information collected by the Payment Element to the Stripe API, access the Elements instance so that you can use it with stripe.confirmPayment.
  const elements = useElements();

  //this hooks use to navigate user to another page.
  const navigate = useNavigate();

  //this state variable use to store infomation about toast.
  //open & close toast & store response from database.
  const [displayToast, setDisplayToast] = useState({
    isShow: false,
    response: null,
  });

  //this function call to show toast to customer & display the message of payment done or not!
  function showToast(responseMessage) {
    setDisplayToast((prevValue) => ({
      ...prevValue,
      isShow: true,
      response: responseMessage,
    }));
    setTimeout(() => {
      setDisplayToast((prevValue) => ({
        ...prevValue,
        isShow: false,
      }));
      navigate("/customer-dashboard/homepage/booked-appointments");
    }, 2000);
  }

  //when user payment done then we navigate to user to booked appointment page.
  function navigateToAppointmentList() {
    navigate("/customer-dashboard/homepage/booked-appointments");
  }
  //submit form to make payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(
        CardCvcElement,
        CardExpiryElement,
        CardNumberElement
      ),
    });

    if (!error) {
      try {
        const customerToken = localStorage.getItem("jwt-token-customer");
        const { id } = paymentMethod;
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}payment`,
          {
            amount: localStorage.getItem("service-price") * 100,
            id,
            appointmentID: localStorage.getItem("appointment-id"),
          },
          {
            headers: {
              "jwt-token-customer": customerToken,
            },
          }
        );
        console.log("resonse of payment", response);
        if (response.data.success) {
          console.log("Successful Payment");
          const responseMessage = response.data.message;
          showToast(responseMessage);
        }
      } catch (err) {
        const responseMessage = err;
        console.log("Error", err);
        showToast(responseMessage);
        if (err.response.status === 401) {
          // window.alert(e.response.statusText);
          navigate("/login");
        }
      }
    } else {
      console.log("hello", error.message);
    }
  };
  return (
    <CContainer>
      <div>
        {/* this condition will diplay toast or not  */}
        {displayToast.isShow && (
          <CToast animation={true} visible={true}>
            <CToastHeader closeButton>
              <svg
                className="rounded me-2"
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
                role="img"
              >
                <rect width="100%" height="100%" fill="#007aff"></rect>
              </svg>
              <div className="fw-bold me-auto">Status Updated</div>
            </CToastHeader>
            <CToastBody>{displayToast.response}</CToastBody>
          </CToast>
        )}

        {/* this Card component display payment form to user. */}
        <CCard
          style={{
            position: "relative",
            top: "300px",
          }}
        >
          <CCardHeader>Enter Card Information</CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <h5 className="text-center">
                Payable Amount: {localStorage.getItem("service-price")}₹
              </h5>
              <CInputGroup>
                <CInputGroupText>Card Number</CInputGroupText>
                <CardNumberElement className="form-control" />
              </CInputGroup>
              <br />
              <CRow>
                <CCol>
                  <CInputGroup>
                    <CInputGroupText>Card Expiry</CInputGroupText>
                    <CardExpiryElement className="form-control" />
                  </CInputGroup>
                </CCol>
                <CCol>
                  <CInputGroup>
                    <CInputGroupText>CVV</CInputGroupText>
                    <CardCvcElement className="form-control" />
                  </CInputGroup>
                </CCol>
                <br />
                <br />
              </CRow>
              <CRow>
                <CCol className="d-grid">
                  <CButton
                    type="submit"
                    className="btn btn-sm btn-info text-center"
                  >
                    Pay
                  </CButton>
                </CCol>
                <CCol className="d-grid">
                  <CButton
                    type="button"
                    className="btn btn-sm btn-danger text-center"
                    onClick={navigateToAppointmentList}
                  >
                    Cancel
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </div>
    </CContainer>
  );
};

export default PaymentForm;
