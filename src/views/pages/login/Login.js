import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormCheck,
  CImage,
} from "@coreui/react";
import axios from "axios";
import CIcon from "@coreui/icons-react";
import { cilInbox, cilLockLocked } from "@coreui/icons";
import PropTypes, { number } from "prop-types";
import { useDispatch } from "react-redux";
import { getBusinessID } from "src/redux-features/reducers/BusinessID";
import { getCustomerID } from "src/redux-features/reducers/CustomerID";
import { useForm } from "react-hook-form";
import KodeTechnolabLogo from "src/assets/images/KodeTechnolab.png";
//this component open modal when user can use both functionality as customer or as business also.
const LoginAsBusinessOrCustomerModelPopup = ({
  visible,
  onClose,
  id1,
  id2,
  jwtValues,
}) => {
  console.log("customer and business id", id1, id2, jwtValues);
  const [isBusinessChecked, setIsBusinessChecked] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("login as business or customer model popup");

  // navigate user to redirect specific page based on selected option.
  //we stored jwt token in location for business or customer
  //we stored customer or business id in gloabal state using dispatch mathod & react-redux.
  const navigateToBusinessDashOrCusDash = () => {
    if (isBusinessChecked) {
      localStorage.setItem("jwt-token-business", jwtValues.tokenForBusiness);
      navigate("/business-owner");
      dispatch(getBusinessID(id2));
    } else {
      localStorage.setItem("jwt-token-customer", jwtValues.tokenForCustomer);
      navigate("/customer-dashboard");
      dispatch(getCustomerID(id1));
    }
  };
  return (
    <div>
      <CModal
        alignment="center"
        visible={visible}
        onClose={onClose}
        aria-labelledby="VerticallyCenteredExample"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">Modal title</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h2 className="text-center mb-4 text-light">
            Login Options <hr />
          </h2>
          <CRow className="mb-3">
            {/* Business Registration */}
            <CCol className="col-1">
              <CFormCheck
                size={"lg"}
                type="radio"
                name="registerOption"
                id="dashboard-business"
                checked={isBusinessChecked}
                onChange={() => {
                  setIsBusinessChecked(true);
                }}
              />
            </CCol>

            <CCol>
              <span>
                <h5>Login as Business</h5>
              </span>
              <p>Login an account to provide services.</p>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            {/* User Registration */}
            <CCol className="col-1">
              <CFormCheck
                size={"lg"}
                type="radio"
                name="registerOption"
                id="dashboard-customer"
                checked={!isBusinessChecked}
                onChange={() => {
                  setIsBusinessChecked(false);
                }}
              />
            </CCol>

            <CCol>
              <span>
                <h5>Login as Customer</h5>
              </span>
              <p>
                Login an account to access personalized features and services.
              </p>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Close
          </CButton>
          <CButton color="primary" onClick={navigateToBusinessDashOrCusDash}>
            Next
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};
LoginAsBusinessOrCustomerModelPopup.propTypes = {
  id1: PropTypes.number.isRequired,
  id2: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  jwtValues: PropTypes.object,
};

//this page display as login page that customer or business
const Login = () => {
  console.log("login");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });
  const [showModel, setShowModel] = useState(false);
  const dispatch = useDispatch();

  //this is state variable to store customer & business id if they're logged in.
  const [storeBusinessAndCustomerID, setStoreBusinessAndCustomerID] = useState({
    tempID1: number,
    tempID2: number,
  });

  //this is jwt token which we storing in this state variable so that we can set in localstorage.
  const [storedToken, setStoredToken] = useState({
    tokenForCustomer: "",
    tokenForBusiness: "",
  });
  const navigate = useNavigate();
  const navigateToChangePasswordPage = () => {
    navigate("/forgot-password");
  };
  const handleFormSubmit = async (data, event) => {
    event.preventDefault();
    try {
      debugger;
      //proprocess.env.REACT_APP_API_URL is a base url using this we can call an api.
      const url = `${process.env.REACT_APP_API_URL}login`;
      const response = await axios.post(url, data);
      if (response.status === 200) {
        console.log("response flag", response);

        //if flag 1 then result is user can login as a business or as a customer to select option in modal popup.
        if (response.data.flag === "1") {
          setStoredToken((prevValue) => ({
            ...prevValue,
            tokenForCustomer: response.data.tokenForCustomer,
            tokenForBusiness: response.data.tokenForBusiness,
          }));
          setStoreBusinessAndCustomerID((prevValue) => ({
            ...prevValue,
            tempID1: response.data.tmpId1,
            tempID2: response.data.tmpId2,
          }));
          setShowModel(true);
        }
        //if flag 2 the result it user logged in as a business
        //we store jwt token for business in localstorage for authentication purpose.
        //we store business id in global state using action method(getBusinessID): react-redux
        else if (response.data.flag === "2") {
          console.log("response message", response.data.Id);
          localStorage.setItem("jwt-token-business", response.data.token);
          dispatch(getBusinessID(response.data.Id));
          navigate("/business-owner");
        }
        //if flag 3 the result it user logged in as a customer.
        //we store jwt token for business in localstorage for authentication purpose.
        //we store customer id in global state using action method(getCustomerID): react-redux
        else if (response.data.flag === "3") {
          console.log("response message", response.data.Id);
          localStorage.setItem("jwt-token-customer", response.data.token);
          dispatch(getCustomerID(response.data.Id));
          navigate("/customer-dashboard");
        }
      } else if (response.status === 401) {
        window.alert(response.data.message);
        console.log("error code", response);
      }
    } catch (err) {
      //if email & password will be wrong then we display alert message that "Credentials are invalid"
      window.alert("Credentials are invalid");
      console.log("error", err);
    }
  };
  return (
    <CContainer
      className="d-flex align-items-center justify-content-center vh-100"
      md
    >
      <div id="login-container">
        <CCard className="p-4" style={{ maxWidth: "400px" }}>
          <CCardBody>
            <CImage src={KodeTechnolabLogo} height={48} />
            <CForm onSubmit={handleSubmit(handleFormSubmit)}>
              <h1>Login</h1>
              <p className="text-medium-emphasis">Sign In to your account</p>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilInbox} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Email Address"
                  type="email"
                  autoComplete="email"
                  name="emailAddress"
                  {...register("emailAddress", {
                    required: true,
                    minLength: 6,
                    maxLength: 30,
                    pattern:
                      /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,})$/i,
                  })}
                />
              </CInputGroup>

              {/* here if user enter any invalid text or breach any rule of pattern then error will occur for email */}
              {errors.emailAddress &&
                errors.emailAddress.type === "required" && (
                  <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                    Email is required
                  </div>
                )}
              {errors.emailAddress &&
                (errors.emailAddress.type === "minLength" ||
                  errors.emailAddress.type === "maxLength") && (
                  <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                    Email length between 6 and 30
                  </div>
                )}
              {errors.emailAddress &&
                errors.emailAddress.type === "pattern" && (
                  <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                    Email should be in pattern
                  </div>
                )}
              <CInputGroup className="mb-4">
                <CInputGroupText>
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>
                <CFormInput
                  type="password"
                  placeholder="Password"
                  name="password"
                  autoComplete="current-password"
                  {...register("password", {
                    required: true,
                    minLength: 8,
                  })}
                />
              </CInputGroup>

              {/* here if user enter any invalid text or breach any rule of pattern then error will occur for password */}
              {errors.password && errors.password.type === "required" && (
                <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                  Password is required
                </div>
              )}
              {errors.password && errors.password.type === "minLength" && (
                <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                  Password should at-least 8 characters
                </div>
              )}
              <CRow>
                <CCol xs={6}>
                  <CButton color="primary" type="submit" className="px-4">
                    Login
                  </CButton>
                </CCol>

                {/* this button for forgot password, business or customer can change their password */}
                <CCol xs={6} className="text-right">
                  <CButton
                    color="link"
                    className="px-0"
                    onClick={navigateToChangePasswordPage}
                  >
                    Forgot password?
                  </CButton>
                </CCol>
              </CRow>
              <p className="text-medium-emphasis text-center mt-3">
                don&apos;t have an account?{" "}
                <Link to="/signup-option-page">Register Now!</Link>
              </p>
            </CForm>
          </CCardBody>
        </CCard>
      </div>

      {/* if user have two account business & customer then we open modal to give options to user that which account do you want to login.  */}
      {showModel && (
        <LoginAsBusinessOrCustomerModelPopup
          id1={storeBusinessAndCustomerID.tempID1}
          id2={storeBusinessAndCustomerID.tempID2}
          visible={showModel}
          jwtValues={storedToken}
          onClose={() => setShowModel(false)}
        />
      )}
    </CContainer>
  );
};

export default Login;
