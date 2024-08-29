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
import axios from "axios";
import CIcon from "@coreui/icons-react";
import InputMask from "react-input-mask";
import TimePicker from "react-bootstrap-time-picker";
import {
  cilLocationPin,
  cilLockLocked,
  cilPhone,
  cilUser,
} from "@coreui/icons";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { getBusinessID } from "src/redux-features/reducers/BusinessID";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
//week days so that business owner can select on which week day business is open or closed.
const days = [
  { label: "mon", value: "mon" },
  { label: "tue", value: "tue" },
  { label: "wed", value: "wed" },
  { label: "thu", value: "thu" },
  { label: "fri", value: "fri" },
  { label: "sat", value: "sat" },
  { label: "sun", value: "sun" },
];

// business owner component... we take parameter in below component which brings data of business information.
const BusinessOwnerRegister = (busDetails) => {
  console.log("business details for bo", busDetails);
  //  const formData = new FormData();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  var isValid = true;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  //this is for handle submit.. all form data will be sent to server (business information & business owner information)
  const handleFormSubmit = async (data, event) => {
    event.preventDefault();
    console.log("hello data", data);
    if (isValid) {
      // submit data code & post api for business registration...
      try {
        //this object is a concated by two object.. 1. business owner values, 2.business details.
        let busPersonalAndProfessionalValues = {
          ...data,
          ...busDetails.busDetails,
        };

        console.log("all values", busPersonalAndProfessionalValues);

        const url = `${process.env.REACT_APP_API_URL}businessRegistrationAndPersonalInformation`;
        const response = await axios.post(
          url,
          busPersonalAndProfessionalValues,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        //if response status success so we'll brought register business id for further use, & navigate to login page.
        if (response.status === 200) {
          window.alert("registration succesfull");
          console.log("get business Id", response);
          dispatch(getBusinessID(response.data.businessID));
          // navigate("/add-business-services");
          navigate("/login");
        }
        // if business is already registered with entered email id then user won't allow to creat business.
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
    <div>
      <CForm
        onSubmit={handleSubmit(handleFormSubmit)}
        encType="multipart/form-data"
      >
        <h1>Personal Information</h1>
        <p className="text-medium-emphasis">Create your account</p>
        {/* business owner name */}
        <CInputGroup className="mb-3">
          <CInputGroupText>
            <CIcon icon={cilUser} />
          </CInputGroupText>
          <CFormInput
            placeholder="Username"
            name="boName"
            {...register("boName", {
              required: true,
              minLength: 5,
              maxLength: 20,
              pattern: /^[a-zA-Z\s]+$/,
            })}
            autoComplete="boName"
          />
        </CInputGroup>
        {errors.boName && errors.boName.type === "required" && (
          <div style={{ fontSize: "14px", color: "#e65a5a" }}>
            name is required
          </div>
        )}
        {errors.boName &&
          (errors.boName.type === "minLength" ||
            errors.boName.type === "maxLength") && (
            <div style={{ fontSize: "14px", color: "#e65a5a" }}>
              minimum lenght is 5 & maximum length is 20
            </div>
          )}
        {errors.boName && errors.boName.type === "pattern" && (
          <div style={{ fontSize: "14px", color: "#e65a5a" }}>
            only letters are allowed
          </div>
        )}
        <CInputGroup className="mb-3">
          <CInputGroupText>
            <CIcon icon={cilLocationPin} />
          </CInputGroupText>
          <CFormInput
            placeholder="Location"
            name="boLocation"
            {...register("boLocation", {
              required: true,
            })}
          />
        </CInputGroup>
        {errors.boLocation && errors.boLocation.type === "required" && (
          <div style={{ fontSize: "14px", color: "#e65a5a" }}>
            Location is required
          </div>
        )}
        <CInputGroup className="mb-3">
          <CInputGroupText>
            <CIcon icon={cilPhone} />
          </CInputGroupText>
          <InputMask
            mask="99999-99999"
            maskChar="_"
            {...register("boPhoneNumber", {
              required: true,
              minLength: 11,
              validate: (value) => (value.includes("_") ? false : true),
            })}
          >
            {(inputProps) => (
              <CFormInput
                type="text"
                id="phoneNumber"
                name="boPhoneNumber"
                placeholder="Enter Phone Number"
                {...inputProps}
              />
            )}
          </InputMask>
        </CInputGroup>
        {errors.boPhoneNumber && errors.boPhoneNumber.type === "required" && (
          <div style={{ fontSize: "14px", color: "#e65a5a" }}>
            phone number is required
          </div>
        )}
        {errors.boPhoneNumber &&
          (errors.boPhoneNumber.type === "minLength" ||
            errors.boPhoneNumber.type === "validate") && (
            <div style={{ fontSize: "14px", color: "#e65a5a" }}>
              Enter valid phone number
            </div>
          )}
        <div className="d-grid">
          <CButton color="success" type="submit">
            Submit
          </CButton>
        </div>
      </CForm>
    </div>
  );
};

// this is business register component.. in which business registration process will be done.
const BusinessRegister = () => {
  var isValid = true;
  const [formValues, setFormValues] = useState(null);
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  //this state variable storing boolean value upon which if business information is valid then we'll call another component which take business owner information.
  const [showBusinessOwnerComponent, setShowBusinessOwnerComponent] =
    useState(false);

  //this is state variable storing business categories so that user can select business category e.g:(medical, insurance, finance etc.)
  const [businessCategories, setBusinessCategories] = useState([]);

  //it is navigate to business owner registration component if data valid then
  const navigateToBusinessOwnerRegisterComponent = (data, event) => {
    event.preventDefault();
    if (isValid) {
      setShowBusinessOwnerComponent(true);
      setFormValues(data);
      console.log("business data", data);
      document.getElementsByClassName("businessInfo")[0].style.display = "none";
    }
  };

  //when first time component load then business categories {dropdown} value will be bind in select business categories.
  async function getBusinessCategories() {
    try {
      const url = `${process.env.REACT_APP_API_URL}businessCategories`;
      const response = await axios.get(url);
      // console.log('form values', inputValue);
      if (response.status === 200) {
        setBusinessCategories(response.data.recordset);
        console.log("Business Categories", response.data.recordset);
      } else {
        console.log(response.statusText);
      }
    } catch (err) {
      console.log("err", err);
    }
  }

  //we'll get data from business_category & convert into label & value for select dropdown..
  const options = businessCategories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  //this hook is run once at time when component rendered at first time..
  useEffect(() => {
    getBusinessCategories();
  }, []);

  //convert seconds to hour:mm
  const secondsToHHMM = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return `${formattedHours}:${formattedMinutes}`;
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CCard className="mx-4">
          <CCardBody className="p-4 ">
            <CForm
              className="businessInfo"
              onSubmit={handleSubmit(navigateToBusinessOwnerRegisterComponent)}
            >
              <div id="bus-register">
                <h1>Register</h1>
                <p className="text-medium-emphasis">Create your account</p>

                <CRow>
                  <CCol className="mb-3" sm={12} xs={12} md={12} lg={6} xl={6}>
                    {/* business name */}
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Business name"
                        name="businessName"
                        {...register("businessName", {
                          required: true,
                          minLength: 5,
                          maxLength: 20,
                        })}
                        autoComplete="businessname"
                      />
                    </CInputGroup>
                    {errors.businessName &&
                      errors.businessName.type === "required" && (
                        <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                          business name is required
                        </div>
                      )}
                    {errors.businessName &&
                      (errors.businessName.type === "minLength" ||
                        errors.businessName.type === "maxLength") && (
                        <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                          length between 5 and 20
                        </div>
                      )}
                  </CCol>
                  <CCol className="mb-3" sm={12} xs={12} md={12} lg={6} xl={6}>
                    {/* email */}
                    <CInputGroup>
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
                        email is required
                      </div>
                    )}
                    {errors.email &&
                      (errors.email.type === "minLength" ||
                        errors.email.type === "maxLength") && (
                        <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                          email length between 6 & 30
                        </div>
                      )}
                    {errors.email && errors.email.type === "pattern" && (
                      <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                        email should be in pattern
                      </div>
                    )}
                  </CCol>
                </CRow>

                <CRow>
                  <CCol className="mb-3" sm={12} xs={12} md={12} lg={6} xl={6}>
                    {/* password */}
                    <CInputGroup>
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
                        password is required
                      </div>
                    )}
                    {errors.password &&
                      errors.password.type === "minLength" && (
                        <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                          password should at-least 8 characters
                        </div>
                      )}
                  </CCol>
                  <CCol className="mb-3" sm={12} xs={12} md={12} lg={6} xl={6}>
                    {" "}
                    {/* repeat password */}
                    <CInputGroup>
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
                          repeat password is required
                        </div>
                      )}
                    {errors.repeatPassword &&
                      (errors.repeatPassword.type === "minLength" ||
                        errors.repeatPassword.type === "maxLength" ||
                        errors.repeatPassword.type === "validate") && (
                        <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                          both password should be same
                        </div>
                      )}
                  </CCol>
                </CRow>

                {/* open & close time */}
                <CRow>
                  <CCol className="mb-3" sm={12} xs={12} md={12} lg={6} xl={6}>
                    <CInputGroup>
                      <CInputGroupText>
                        <span>Open Time</span>
                      </CInputGroupText>
                      <Controller
                        name="openTime"
                        control={control}
                        rules={{ required: true }}
                        render={({
                          field: { onChange, onBlur, value, name },
                        }) => (
                          <TimePicker
                            id={name}
                            name={name}
                            onChange={(selectedSeconds) =>
                              onChange(secondsToHHMM(selectedSeconds))
                            }
                            onBlur={onBlur}
                            value={value}
                          />
                        )}
                      />
                    </CInputGroup>
                    {errors.openTime && errors.openTime.type === "required" && (
                      <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                        define open hour
                      </div>
                    )}
                  </CCol>
                  <CCol className="mb-3" sm={12} xs={12} md={12} lg={6} xl={6}>
                    <CInputGroup>
                      <CInputGroupText>
                        <span>Close Time</span>
                      </CInputGroupText>
                      <Controller
                        name="closeTime"
                        control={control}
                        rules={{ required: true }}
                        render={({
                          field: { onChange, onBlur, value, name },
                        }) => (
                          <TimePicker
                            id={name}
                            name={name}
                            onChange={(selectedSeconds) =>
                              onChange(secondsToHHMM(selectedSeconds))
                            }
                            onBlur={onBlur}
                            value={value}
                          />
                        )}
                      />
                    </CInputGroup>
                    {errors.closeTime &&
                      errors.closeTime.type === "required" && (
                        <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                          define close hour
                        </div>
                      )}
                  </CCol>
                </CRow>

                <CRow>
                  <CCol className="mb-3" sm={12} xs={12} md={12} lg={6} xl={6}>
                    {/* location */}
                    <CInputGroup>
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
                        location is required
                      </div>
                    )}
                  </CCol>
                  <CCol className="mb-3" sm={12} xs={12} md={12} lg={6} xl={6}>
                    {/* phone no */}
                    <CInputGroup>
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
                            placeholder="Enter Phone Number"
                            {...inputProps}
                          />
                        )}
                      </InputMask>
                    </CInputGroup>
                    {errors.phoneNumber &&
                      errors.phoneNumber.type === "required" && (
                        <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                          phone number is required
                        </div>
                      )}
                    {errors.phoneNumber &&
                      (errors.phoneNumber.type === "minLength" ||
                        errors.phoneNumber.type === "validate") && (
                        <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                          Enter valid phone number
                        </div>
                      )}
                  </CCol>
                </CRow>

                {/* select business image */}
                <CInputGroup className="mb-3">
                  <Controller
                    control={control}
                    name="imgFile"
                    rules={{
                      required: "business logo is required",
                      validate: {
                        fileSize: (value) =>
                          value?.size > 5000000 ? false : true,
                      },
                    }}
                    render={({ field: { value, onChange, ...field } }) => {
                      return (
                        <CFormInput
                          {...field}
                          onChange={(event) => {
                            onChange(event.target.files[0]);
                          }}
                          type="file"
                          id="imFile"
                          placeholder="Choose an Image"
                        />
                      );
                    }}
                  />
                </CInputGroup>

                {/* error for file */}
                {errors.imgFile && errors.imgFile?.type === "required" && (
                  <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                    select business image.
                  </div>
                )}
                {errors.imgFile && errors.imgFile?.type === "fileSize" && (
                  <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                    Image size should be between 1 MB to 5 MB
                  </div>
                )}

                {/* Latitude & Longitude */}
                <CRow>
                  <CCol className="mb-3" sm={12} xs={12} md={12} lg={6} xl={6}>
                    <CInputGroup>
                      <CInputGroupText>
                        <span>Latitude</span>
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Latitude"
                        name="latitude"
                        {...register("latitude", {
                          required: true,
                        })}
                      />
                    </CInputGroup>
                    {errors.latitude && errors.latitude.type === "required" && (
                      <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                        latitude is required
                      </div>
                    )}
                  </CCol>
                  <CCol className="mb-3" sm={12} xs={12} md={12} lg={6} xl={6}>
                    <CInputGroup>
                      <CInputGroupText>
                        <span>Longitude</span>
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Longitude"
                        name="longitude"
                        {...register("longitude", {
                          required: true,
                        })}
                      />
                    </CInputGroup>
                    {errors.longitude &&
                      errors.longitude.type === "required" && (
                        <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                          longitude is required
                        </div>
                      )}
                  </CCol>
                </CRow>

                {/* business category */}
                <CRow>
                  <CCol className="mb-3" sm={12} xs={12} md={12} lg={6} xl={6}>
                    <CInputGroup>
                      <CInputGroupText>
                        <span>Select Category</span>
                      </CInputGroupText>
                      <CFormSelect
                        htmlSize={1}
                        name="busiessCategory"
                        options={options}
                        {...register("busiessCategory", {
                          required: true,
                          validate: (value) => (value === "-1" ? false : true),
                        })}
                      ></CFormSelect>
                    </CInputGroup>
                    {errors.busiessCategory &&
                      errors.busiessCategory.type === "required" && (
                        <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                          select business category
                        </div>
                      )}
                    {errors.busiessCategory &&
                      errors.busiessCategory.type === "validate" && (
                        <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                          select business category
                        </div>
                      )}
                  </CCol>

                  <CCol className="mb-3" sm={12} xs={12} md={12} lg={6} xl={6}>
                    {/* select days[mon,tue,wed...] */}
                    <CInputGroup>
                      <CInputGroupText>
                        <span>Select Days</span>
                      </CInputGroupText>
                      <CCol>
                        <Controller
                          name="selectDay"
                          control={control}
                          rules={{ required: true }}
                          render={({
                            field: { onChange, onBlur, value, name },
                          }) => (
                            <Select
                              options={days}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              name={name}
                              isMulti={true}
                              className="basic-multi-select"
                              classNamePrefix="select"
                            />
                          )}
                        />
                      </CCol>
                    </CInputGroup>
                    {errors.selectDay &&
                      errors.selectDay.type === "required" && (
                        <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                          select at least one day
                        </div>
                      )}
                  </CCol>
                </CRow>
                <CButton
                  size="sm"
                  className="mx-auto d-grid  col-6"
                  type="submit"
                  color="success"
                >
                  Next
                </CButton>
              </div>
            </CForm>
            {/* this ternary condition will be render component conditionaly..& display business owner component  */}
            {showBusinessOwnerComponent ? (
              <BusinessOwnerRegister busDetails={formValues} />
            ) : null}
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  );
};

export default BusinessRegister;
