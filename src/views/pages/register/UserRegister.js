import React, { useEffect, useState } from "react";
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
  CFormSelect,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import axios from "axios";
import InputMask from "react-input-mask";
import {
  cilLocationPin,
  cilLockLocked,
  cilUser,
  cilPhone,
} from "@coreui/icons";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const UserRegister = () => {
  console.log("customer register");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  //we use useNavigate hook so that we can navigate user to other page.
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [state, setStates] = useState([]);
  const [city, setCities] = useState([]);
  var isValid = true;

  //this useEffect use called once when componet load & in that we call getCountries function to get country list for user.
  useEffect(() => {
    getCountries();
  }, []);

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

  //get state based on specific country selected
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
  //get city based on specific state selected
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

  const handleFormSubmit = async (data, event) => {
    event.preventDefault();
    // console.log("form data", data);
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
      try {
        const url = `${process.env.REACT_APP_API_URL}customerRegistration`;
        const response = await axios.post(url, data);
        // console.log('form values', inputValue);

        //if response is successfull then we redirect user to login page.
        if (response.status === 200) {
          window.alert("registration successful");
          navigate("/login");
        }
        //user can't register as customer with same email id again & again.
        else {
          window.alert("Email Already Exist");
          console.log(response.data);
        }
      } catch (err) {
        console.log("err", err);
      }
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit(handleFormSubmit)}>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>
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

                  {/* user got error if he not enter valid text.  */}
                  {errors.userName && errors.userName.type === "required" && (
                    <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                      name is required
                    </div>
                  )}

                  {/* if user enter any numbers then we display error message. */}
                  {errors.userName && errors.userName.type === "pattern" && (
                    <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                      only letters are allowed
                    </div>
                  )}

                  {/* if the input value size not in lenth then we display error message. */}
                  {errors.userName &&
                    (errors.userName.type === "minLength" ||
                      errors.userName.type === "maxLength") && (
                      <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                        Name length between 5 and 20
                      </div>
                    )}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      type="email"
                      name="email"
                      {...register("email", {
                        required: true,
                        minLength: 6,
                        maxLength: 30,
                        pattern:
                          /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,})$/i,
                      })}
                    />
                  </CInputGroup>
                  {errors.email && errors.email.type === "required" && (
                    <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                      Email is required
                    </div>
                  )}
                  {errors.email &&
                    (errors.email.type === "minLength" ||
                      errors.email.type === "maxLength") && (
                      <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                        Email length between 6 & 30
                      </div>
                    )}

                  {/* if email is not in specific format then we display error message. */}
                  {errors.email && errors.email.type === "pattern" && (
                    <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                      Email should be in pattern
                    </div>
                  )}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      name="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      {...register("password", {
                        required: true,
                        minLength: 8,
                      })}
                    />
                  </CInputGroup>
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
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      name="repeatPassword"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      {...register("repeatPassword", {
                        required: true,
                        minLength: 8,
                        maxLength: "passsword".length,
                        validate: (value, formValues) =>
                          formValues.password === value, // Check if it's equal to the 'password' field
                      })}
                    />
                  </CInputGroup>
                  {errors.repeatPassword &&
                    errors.repeatPassword.type === "required" && (
                      <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                        Repeat password is required
                      </div>
                    )}

                  {/* both password must be same for confirmataion purpose. */}
                  {errors.repeatPassword &&
                    (errors.repeatPassword.type === "minLength" ||
                      errors.repeatPassword.type === "maxLength" ||
                      errors.repeatPassword.type === "validate") && (
                      <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                        Both password should be same
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
                        validate: (value) =>
                          value.includes("_") ? false : true,
                      })}
                    >
                      {(inputProps) => (
                        <CFormInput
                          type="text"
                          id="phoneNumber"
                          name="phoneNumber"
                          {...inputProps}
                        />
                      )}
                    </InputMask>
                  </CInputGroup>
                  {errors.phoneNumber &&
                    errors.phoneNumber.type === "required" && (
                      <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                        Phone number is required
                      </div>
                    )}
                  {/* if phone number's field will empty then we display error.  */}
                  {errors.phoneNumber &&
                    (errors.phoneNumber.type === "minLength" ||
                      errors.phoneNumber.type === "validate") && (
                      <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                        Enter valid phone number
                      </div>
                    )}
                  {/* click to register as customer. */}
                  <div className="d-grid">
                    <CButton color="success" type="submit">
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default UserRegister;
