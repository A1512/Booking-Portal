import React, { useEffect, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import InputMask from "react-input-mask";
import {
  cilCreditCard,
  cilFile,
  cilLocationPin,
  cilLockLocked,
  cilPhone,
  cilSettings,
  cilUser,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import axios from "axios";
import { useSelector } from "react-redux";

// import avatar8 from "src/assets/images/avatars/8.jpg";
const EditCustomerInformationModal = ({ onClose, changeProfileState }) => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
  });

  const navigate = useNavigate();
  const getCustomerID = useSelector((state) => state.customerID.value);

  const [countries, setCountries] = useState([]);

  const [state, setStates] = useState([]);
  const [city, setCities] = useState([]);

  useEffect(() => {
    getCountries();
    getCustomerDataByID();
  }, []);

  //get customer data
  async function getCustomerDataByID() {
    try {
      const customerToken = localStorage.getItem("jwt-token-customer");
      const url = `${process.env.REACT_APP_API_URL}getCustomerDataById`;
      const response = await axios.post(
        url,
        {
          customerID: getCustomerID,
        },
        {
          headers: {
            "jwt-token-customer": customerToken,
          },
        }
      );
      // console.log('form values', inputValue);
      if (response.status === 200) {
        // console.log("hello ==>", response.data.recordset[0]);
        for (const key in response.data.recordset[0]) {
          setValue(key, response.data.recordset[0][key]);
        }
      } else {
        console.log(response.statusText);
      }
    } catch (err) {
      if (err.response.status === 401) {
        // window.alert(e.response.statusText);
        navigate("/login");
      } else {
        console.log("err", err);
      }
    }
  }
  //get countries data
  async function getCountries() {
    try {
      const url = `${process.env.REACT_APP_API_URL}getCoutryList`;
      const response = await axios.get(url);
      // console.log('form values', inputValue);
      if (response.status === 200) {
        setCountries(response.data.recordset);
        // console.log('Countries', response.data.recordset);
      } else {
        console.log(response.statusText);
      }
    } catch (err) {
      console.log("err", err);
    }
  }

  //get state based on specific country
  async function getStateByCountry(value) {
    console.log("value of country", value);
    try {
      const url = `${process.env.REACT_APP_API_URL}getStateListByCountry`;
      const response = await axios.post(url, {
        countryID: value,
      });
      // console.log('form values', inputValue);
      if (response.status === 200) {
        setStates(response.data.recordset);
        console.log("states", response.data.recordset);
      } else {
        console.log(response.statusText);
      }
    } catch (err) {
      console.log("err", err);
    }
  }
  //get city based on specific country
  async function getCityByState(value) {
    console.log("value of state", value);
    try {
      const url = `${process.env.REACT_APP_API_URL}getCityListByState`;
      const response = await axios.post(url, {
        stateID: value,
      });
      // console.log('form values', inputValue);
      if (response.status === 200) {
        setCities(response.data.recordset);
        // console.log('states', response.data.recordset);
      } else {
        console.log(response.statusText);
      }
    } catch (err) {
      console.log("err", err);
    }
  }

  //we'll get data from tbl_country & convert into label & value for select dropdown..
  const options = countries.map((country) => ({
    label: country.name,
    value: country.id,
  }));

  //we'll get data from tbl_state & convert into label & value for select dropdown..
  const stateOptions = state.map((state) => ({
    label: state.name,
    value: state.id,
  }));

  //we'll get data from tbl_city & convert into label & value for select dropdown..
  const cityOptions = city.map((state) => ({
    label: state.name,
    value: state.id,
  }));
  const handleCloseModal = () => {
    onClose();
  };

  const handleFormSubmit = async (data, event) => {
    event.preventDefault();
    if (data.country === "-1") {
      setError("country", { type: "manual", message: "country is required" });
      return;
    } else if (data.state === "-1") {
      setError("state", { type: "manual", message: "state is required" });
      return;
    } else if (data.city === "-1") {
      setError("city", { type: "manual", message: "city is required" });
      return;
    }
    if (isValid) {
      console.log("edit cus profile", data);
      try {
        const customerToken = localStorage.getItem("jwt-token-customer");
        data.customerID = getCustomerID; // add customer id to form data..
        const url = `${process.env.REACT_APP_API_URL}updateCustomerProfileData`;
        const response = await axios.post(url, data, {
          headers: {
            "jwt-token-customer": customerToken,
          },
        });
        // console.log('form values', inputValue);
        if (response.status === 200) {
          window.alert(response.data.message);
          onClose(); // close modal when data successfully updated. this will affect in parent componenet
        } else {
          window.alert(response.data.message);
        }
      } catch (err) {
        console.log("err", err);
        if (err.response.status === 401) {
          // window.alert(e.response.statusText);
          navigate("/login");
        }
      }
    }
  };
  return (
    <CModal
      backdrop="static"
      keyboard={false}
      visible={changeProfileState}
      onClose={handleCloseModal}
      aria-labelledby="LiveDemoExampleLabel"
    >
      <CModalHeader onClose={handleCloseModal}>
        <CModalTitle id="LiveDemoExampleLabel">Account Info</CModalTitle>
      </CModalHeader>
      <CModalBody className="p-4">
        <CForm onSubmit={handleSubmit(handleFormSubmit)}>
          <h5>Change Account Info</h5>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              placeholder="Username"
              name="userName"
              {...register("userName", {
                required: true,
                minLength: 5,
                maxLength: 20,
                pattern: /^[a-zA-Z\s]+$/,
              })}
              autoComplete="username"
            />
          </CInputGroup>
          {errors.userName && errors.userName.type === "required" && (
            <div style={{ fontSize: "14px", color: "#e65a5a" }}>
              name is required
            </div>
          )}
          {errors.userName && errors.userName.type === "pattern" && (
            <div style={{ fontSize: "14px", color: "#e65a5a" }}>
              only letters are allowed
            </div>
          )}
          {errors.userName &&
            (errors.userName.type === "minLength" ||
              errors.userName.type === "maxLength") && (
              <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                Name length between 5 and 20
              </div>
            )}
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilLocationPin} />
            </CInputGroupText>
            <CFormInput
              placeholder="Location"
              name="location"
              {...register("location", {
                required: true,
              })}
            />
          </CInputGroup>
          {errors.location && errors.location.type === "required" && (
            <div style={{ fontSize: "14px", color: "#e65a5a" }}>
              Location is required
            </div>
          )}
          {/* select country */}
          <CRow className="mb-3">
            <CCol>
              <CInputGroup>
                <CInputGroupText>
                  <span>Select Country</span>
                </CInputGroupText>
                <CFormSelect
                  name="country"
                  options={options}
                  {...register("country", {
                    required: true,
                    // validate: (value, formFields) => formFields.country && value === '-1',
                    onChange: (e) => {
                      getStateByCountry(e.target.value);
                    },
                  })}
                ></CFormSelect>
              </CInputGroup>
              {errors.country && errors.country.type === "required" && (
                <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                  Select a country
                </div>
              )}
              {errors.country && (
                <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                  {errors.country.message}
                </div>
              )}
            </CCol>
          </CRow>

          {/* select state */}
          <CRow className="mb-3">
            <CCol>
              <CInputGroup>
                <CInputGroupText>
                  <span>Select State</span>
                </CInputGroupText>
                <CFormSelect
                  name="state"
                  options={stateOptions}
                  {...register("state", {
                    required: true,
                    // validate: (value, formFields) => formFields.country && value === '-1',
                    onChange: (e) => {
                      getCityByState(e.target.value);
                    },
                  })}
                ></CFormSelect>
              </CInputGroup>
              {errors.state && errors.state.type === "required" && (
                <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                  State is required
                </div>
              )}
              {errors.state && (
                <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                  {errors.state.message}
                </div>
              )}
            </CCol>
          </CRow>
          {/* select city */}
          <CRow className="mb-3">
            <CCol>
              <CInputGroup>
                <CInputGroupText>
                  <span>Select City</span>
                </CInputGroupText>
                <CFormSelect
                  name="city"
                  options={cityOptions}
                  {...register("city", {
                    required: true,
                  })}
                ></CFormSelect>
              </CInputGroup>
              {errors.city && errors.city.type === "required" && (
                <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                  City is required
                </div>
              )}
              {errors.city && (
                <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                  {errors.city.message}
                </div>
              )}
            </CCol>
          </CRow>

          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilPhone} />
            </CInputGroupText>
            <InputMask
              mask="99999-99999"
              maskChar="_"
              {...register("phoneNumber", {
                required: true,
                minLength: 11,
                validate: (value) => (value.includes("_") ? false : true),
              })}
            >
              {(inputProps) => (
                <CFormInput
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  {...inputProps}
                />
              )}
            </InputMask>
          </CInputGroup>
          {errors.phoneNumber && errors.phoneNumber.type === "required" && (
            <div style={{ fontSize: "14px", color: "#e65a5a" }}>
              Phone number is required
            </div>
          )}
          {errors.phoneNumber &&
            (errors.phoneNumber.type === "minLength" ||
              errors.phoneNumber.type === "validate") && (
              <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                Enter valid phone number
              </div>
            )}
          <CButton color="primary" type="submit">
            Save changes
          </CButton>
        </CForm>
      </CModalBody>
    </CModal>
  );
};

EditCustomerInformationModal.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
  changeProfileState: PropTypes.bool,
};
const AppHeaderDropdown = () => {
  const navigate = useNavigate();

  const [chnageProfileModal, setChangeProfileModal] = useState(false);
  const [dropdownOpenOnModalClose, setDropdownOpenOnModalClose] =
    useState(false);
  const navigateToLogin = () => {
    navigate("/login");
  };
  const navigateToAppointments = () => {
    navigate("/customer-dashboard/homepage/booked-appointments");
  };
  const navigateToPayments = () => {
    navigate("/customer-dashboard/homepage/customer/payment-list");
  };
  const navigateToChangePassword = () => {
    navigate("/forgot-password");
  };
  const changeCustomerProfile = () => {
    setChangeProfileModal(true);
    setDropdownOpenOnModalClose(false);
  };

  const handleModalCloseInEditProfile = () => {
    setChangeProfileModal(false);
    setDropdownOpenOnModalClose(true);
  };
  return (
    <>
      <CDropdown variant="nav-item" visible={dropdownOpenOnModalClose}>
        <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
          <CIcon icon={cilUser} size="lg" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-light fw-semibold py-2">
            Settings
          </CDropdownHeader>
          <CDropdownItem
            onClick={changeCustomerProfile}
            style={{ cursor: "pointer" }}
          >
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
          <CDropdownItem
            onClick={navigateToChangePassword}
            style={{ cursor: "pointer" }}
          >
            <CIcon icon={cilSettings} className="me-2" />
            Change Password
          </CDropdownItem>
          <CDropdownItem
            onClick={navigateToPayments}
            style={{ cursor: "pointer" }}
          >
            <CIcon icon={cilCreditCard} className="me-2" />
            Payments
          </CDropdownItem>
          <CDropdownItem
            onClick={navigateToAppointments}
            style={{ cursor: "pointer" }}
          >
            <CIcon icon={cilFile} className="me-2" />
            Appointments
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem
            onClick={navigateToLogin}
            style={{ cursor: "pointer" }}
          >
            <CIcon icon={cilLockLocked} className="me-2" />
            Lock Account
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      {chnageProfileModal && (
        <EditCustomerInformationModal
          changeProfileState={chnageProfileModal}
          onClose={handleModalCloseInEditProfile}
        />
      )}
    </>
  );
};

export default AppHeaderDropdown;
