import TimePicker from "react-bootstrap-time-picker";
import { useForm, Controller } from "react-hook-form";
import PropTypes from "prop-types";
import axios from "axios";
import { useSelector } from "react-redux";
import InputMask from "react-input-mask";
import Select from "react-select";
import {
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
  CButton,
  CCol,
  CContainer,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { cilLocationPin, cilPhone, cilUser } from "@coreui/icons";
import { useNavigate } from "react-router-dom";
import CIcon from "@coreui/icons-react";
//week days so that business owner can select the business day...
const days = [
  { label: "mon", value: "mon" },
  { label: "tue", value: "tue" },
  { label: "wed", value: "wed" },
  { label: "thu", value: "thu" },
  { label: "fri", value: "fri" },
  { label: "sat", value: "sat" },
  { label: "sun", value: "sun" },
];

const EditBusinessAndPersonalInformationModal = ({
  onClose,
  changeProfileState,
}) => {
  var isValid = true;
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  var setDefualtValueInWeekDay;
  const navigate = useNavigate();
  const getBusinessID = useSelector((state) => state.businessID.value);
  const [businessCategories, setBusinessCategories] = useState([]);
  const handleCloseModal = () => {
    onClose();
  };

  function setDaysInWeekDay(selectedDays) {
    // console.log("week days", selectedDays);
    const listOfSelectedDays = selectedDays.split(",");
    const defaultValue = listOfSelectedDays.map((days) => ({
      label: days,
      value: days,
    }));
    return defaultValue;
  }

  //when first time component load then business categories {dropdown} value will be bind in select business categories.
  async function getBusinessInfoAndPersonalInfo() {
    try {
      const url = `${process.env.REACT_APP_API_URL}getBusinessInfoForEditProfile`;
      const businessToken = localStorage.getItem("jwt-token-business");
      const response = await axios.post(
        url,
        { businessID: getBusinessID },
        {
          headers: {
            "jwt-token-business": businessToken,
          },
        }
      );
      // console.log('form values', inputValue);
      if (response.status === 200) {
        console.log("res for busines info", response.data);
        for (const key in response.data) {
          if (key === "boPhoneNumber") {
            // For InputMask
            // const input = document.getElementById("boPhoneNumber");
            // input.value = response.data[key];
            continue;
          } else if (key === "phoneNumber") {
            // const input = document.getElementById("phoneNumber");
            // input.value = response.data[key];
            continue;
          } else if (key === "selectDay") {
            // For Select
            const selectedDays = response.data[key];
            setDefualtValueInWeekDay = setDaysInWeekDay(selectedDays);
            setValue(key, setDefualtValueInWeekDay); // Assuming 'setValue' can be used
          } else {
            // For other inputs
            setValue(key, response.data[key]);
          }
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

  //convert seconds to hour:mm
  const secondsToHHMM = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return `${formattedHours}:${formattedMinutes}`;
  };

  //this hook is run once at time when component rendered at first time..
  useEffect(() => {
    getBusinessCategories();
    getBusinessInfoAndPersonalInfo();
  }, []);
  const handleFormSubmit = async (data, event) => {
    event.preventDefault();
    if (isValid) {
      try {
        debugger;
        const businessToken = localStorage.getItem("jwt-token-business");
        data.businessID = getBusinessID; // add businessID to form data..
        // console.log("edit business profile", data);
        const url = `${process.env.REACT_APP_API_URL}updateBusinessProfileData`;
        const response = await axios.post(url, data, {
          headers: {
            "jwt-token-business": businessToken,
            "Content-Type": "multipart/form-data",
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
      size="xl"
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
        <CForm
          encType="multipart/form-data"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          {/* business information */}
          <CContainer>
            <h5 className="text-warning">Business Information</h5>
            <CRow>
              <CCol sm={12} xs={12} md={12} lg={6} xl={6}>
                {" "}
                {/* business name */}
                <CInputGroup className="mb-3">
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
              <CCol sm={12} xs={12} md={12} lg={6} xl={6}>
                {" "}
                {/* location */}
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
                    location is required
                  </div>
                )}
              </CCol>
            </CRow>

            {/* open & close time */}
            <CRow>
              <CCol sm={12} xs={12} md={12} lg={6} xl={6}>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <span>Open Time</span>
                  </CInputGroupText>
                  <Controller
                    name="openTime"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value, name } }) => (
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
              <CCol sm={12} xs={12} md={12} lg={6} xl={6}>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <span>Close Time</span>
                  </CInputGroupText>
                  <Controller
                    name="closeTime"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value, name } }) => (
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
                {errors.closeTime && errors.closeTime.type === "required" && (
                  <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                    define close hour
                  </div>
                )}
              </CCol>
            </CRow>

            <CRow>
              <CCol sm={12} xs={12} md={12} lg={6} xl={6}>
                {/* select business image */}
                <strong className="text-info" style={{ fontSize: "12px" }}>
                  note: image is not mandatory
                </strong>
                <CInputGroup className="mb-3">
                  <Controller
                    control={control}
                    name="imgFile"
                    rules={{
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
                {errors.imgFile && errors.imgFile?.type === "fileSize" && (
                  <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                    Image size should be between 1 MB to 5 MB
                  </div>
                )}
              </CCol>
              <CCol sm={12} xs={12} md={12} lg={6} xl={6}>
                {" "}
                {/* phone no */}
                <br />
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

            {/* Latitude & Longitude */}
            <CRow>
              <CCol sm={12} xs={12} md={12} lg={6} xl={6}>
                <CInputGroup className="mb-3">
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
              <CCol sm={12} xs={12} md={12} lg={6} xl={6}>
                <CInputGroup className="mb-3">
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
                {errors.longitude && errors.longitude.type === "required" && (
                  <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                    longitude is required
                  </div>
                )}
              </CCol>
            </CRow>

            <CRow>
              <CCol sm={12} xs={12} md={12} lg={6} xl={6}>
                {" "}
                {/* business category */}
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <span>Select Category</span>
                  </CInputGroupText>
                  <CFormSelect
                    name="busiessCategory"
                    options={options}
                    {...register("busiessCategory", {
                      required: true,
                    })}
                  ></CFormSelect>
                </CInputGroup>
                {errors.busiessCategory &&
                  errors.busiessCategory.type === "required" && (
                    <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                      select business category
                    </div>
                  )}
              </CCol>
              <CCol sm={12} xs={12} md={12} lg={6} xl={6}>
                {" "}
                {/* select days[mon,tue,wed...] */}
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <span>Select Days</span>
                  </CInputGroupText>
                  <CCol>
                    <Controller
                      name="selectDay"
                      id="selectDay"
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
                {errors.selectDay && errors.selectDay.type === "required" && (
                  <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                    select at least one day
                  </div>
                )}
              </CCol>
            </CRow>

            {/* business owner information */}
            <br />
            <h5 className="text-warning">Personal Information</h5>
            <CRow>
              <CCol sm={12} xs={12} md={12} lg={4} xl={4}>
                {/* business owner name */}
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="User name"
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
                {errors.boName && errors.boName.type === "pattern" && (
                  <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                    only letters are allowed
                  </div>
                )}
              </CCol>
              <CCol sm={12} xs={12} md={12} lg={4} xl={4}>
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
              </CCol>
              <CCol sm={12} xs={12} md={12} lg={4} xl={4}>
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
                        id="boPhoneNumber"
                        name="boPhoneNumber"
                        placeholder="Enter Phone Number"
                        {...inputProps}
                      />
                    )}
                  </InputMask>
                </CInputGroup>
                {errors.boPhoneNumber &&
                  errors.boPhoneNumber.type === "required" && (
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
              </CCol>
            </CRow>
          </CContainer>
          <br />
          <CButton color="primary" type="submit">
            Save changes
          </CButton>
        </CForm>
      </CModalBody>
    </CModal>
  );
};
export default EditBusinessAndPersonalInformationModal;

EditBusinessAndPersonalInformationModal.propTypes = {
  onClose: PropTypes.func,
  changeProfileState: PropTypes.bool,
};
