import React, { useEffect } from "react";
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
  CFormTextarea,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilDescription, cilLockLocked } from "@coreui/icons";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";

//this component display service form to business.
//business can add multiple  services with image, price, service name, short desc, long desc.

//here we take parameter (viewHeight,closeModal) because this component also called in business dashboard in that if business wants to add more services they can.
//so in that business dashaboard when we open & close the modal at that time i've to change state in this component.
const AddBusinessServices = ({ viewHeight, closeModal }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  var isValid = true;
  //here i used useFieldArray hook of react-hook-form that provides business to add multiple services.
  const { fields, append, remove } = useFieldArray({
    control,
    name: "services", // name of the field array in your form
  });

  //useSelector hook which we can get state values:
  const registeredBusinessID = useSelector((state) => state.businessID);

  //this formData object used to pass file, front-end to back-end.
  const formData = new FormData();

  //this hook navigate business to other page.
  const navigate = useNavigate();

  //this hook will call once when component load.
  //it check params "viewHeight", if it is available then it change the classname of given ID to change to CSS.
  useEffect(() => {
    var rootContainerID = document.getElementById("rootContainer");
    viewHeight === 0
      ? rootContainerID?.setAttribute("class", null)
      : rootContainerID?.setAttribute("className", "vh-100");
  }, [viewHeight]);

  //when this component load it will show default form to busieness.
  useEffect(() => {
    if (fields.length === 0) {
      append({
        imgFile: "",
        price: "",
        imgName: "",
        shortDesc: "",
        longDesc: "",
      });
    }
  }, []);

  //this component call when business save the services.
  // it will take all information which business entered.
  const serviceData = async (data, event) => {
    // event.preventDefault(); // Prevent the default form submission behavior
    console.log("business services data", data);
    let serviceList = data.services;
    //if data is valid then it will proceed ahead.

    //below filter array is used for to check if service name is not duplicate
    let duplicateNames = serviceList.filter((service, index) => {
      return (
        serviceList.findIndex((obj) => obj.imgName === service.imgName) !==
        index
      );
    });
    if (duplicateNames.length > 0) {
      isValid = false;
      alert("duplicate service name is not allowed");
      return;
    }

    if (isValid) {
      try {
        // formData.append('imgFile', inputValue[1].imgFile);

        //here we iterate loop so we can add our serivice data in formData object.
        data.services.forEach((service) => {
          formData.append("imgFile", service.imgFile[0]);
          formData.append("imgName", service.imgName);
          formData.append("imgPrice", service.price);
          formData.append("shortDesc", service.shortDesc);
          formData.append("longDesc", service.longDesc);
        });
        formData.append("value", registeredBusinessID.value);
        // console.log('hello', formData.get('imgFile'));
        // console.log('business id', registeredBusinessID);
        const businessToken = localStorage.getItem("jwt-token-business");
        const url = `${process.env.REACT_APP_API_URL}addBusinessServices`;
        const response = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "jwt-token-business": businessToken,
          },
        });
        if (response.status === 201) {
          const message = response.data.message;
          alert(`service named: ${message} already exists`);
        } else if (response.status === 200) {
          alert(response.data.message);
          //here if data is valid & closeModal props is passed then we call function closeModal() so it will close the business serivce modal in business dashboard, if not then we'll navigate business to login page.
          if (isValid && closeModal) {
            closeModal();
          }
          // else if (isValid && !closeModal) {
          //   navigate("/login");
          // }
        }
      } catch (err) {
        if (err.response.status === 401) {
          // window.alert(e.response.statusText);
          navigate("/login");
        } else {
          console.log("error", err);
        }
      }
    } else {
      alert("fill the form");
    }
  };

  return (
    // this container display business services form.
    <CContainer
      id="rootContainer"
      className=" d-flex align-items-center justify-content-center vh-100"
    >
      <div id="business-services-container">
        <CCard className="p-2" style={{ width: "auto" }}>
          <CCardBody>
            <CForm
              encType={"multipart/form-data"}
              onSubmit={handleSubmit(serviceData)}
            >
              <h1>Business Services</h1>
              <p className="text-medium-emphasis">
                Add Services with Image & Name & Price
              </p>
              <div className=" overflow-auto p-4" style={{ height: "400px" }}>
                {fields.map((service, index) => {
                  return (
                    <CRow key={service.id} className="m-2 p-2 border">
                      {/* <span>TEST</span>
                      {JSON.stringify(service)} */}
                      <CCol sm={12} xs={12} md={12} lg={4} xl={4} xxl={4}>
                        <CInputGroup className="mb-3">
                          <CFormInput
                            placeholder="Choose an Image"
                            type="file"
                            accept="image/*,video/*"
                            {...register(`services[${index}].imgFile`, {
                              required: true,
                              validate: {
                                fileSize: (value) =>
                                  value[0]?.size > 5000000 ? false : true, // when file size is >5mb it returns false & show the error message(it indicates that validations false)
                              },
                            })}
                          />
                          {service[index]?.imgFile && (
                            <div style={{ marginLeft: "10px" }}>
                              {service[index].imgFile.name}
                            </div>
                          )}
                        </CInputGroup>

                        {/* error for file */}
                        {/* 
                        {error && error[index]?.imgFile ? (
                          <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                            {error[index]?.imgFile}
                          </div>
                        ) : (
                          ""
                        )} */}
                        {errors?.services &&
                          errors?.services[index]?.imgFile &&
                          errors?.services[index]?.imgFile?.type ===
                            "required" && (
                            <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                              Image is required
                            </div>
                          )}
                        {errors?.services &&
                          errors?.services[index]?.imgFile &&
                          errors?.services[index]?.imgFile?.type ===
                            "fileSize" && (
                            <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                              Image size should be between 1 MB to 5 MB
                            </div>
                          )}
                      </CCol>
                      <CCol sm={12} xs={12} md={12} lg={4} xl={4} xxl={4}>
                        <CInputGroup className="mb-4">
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            type="text"
                            placeholder="Service Name"
                            {...register(`services[${index}].imgName`, {
                              required: true,
                            })}
                          />
                        </CInputGroup>

                        {/* error for name */}
                        {errors?.services &&
                          errors?.services[index]?.imgName &&
                          errors?.services[index]?.imgName?.type ===
                            "required" && (
                            <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                              Service name is required
                            </div>
                          )}
                      </CCol>
                      <CCol sm={12} xs={12} md={12} lg={4} xl={4} xxl={4}>
                        <CInputGroup className="mb-4">
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            type="text"
                            placeholder="Service Price(₹)"
                            {...register(`services[${index}].price`, {
                              required: true,
                              pattern: /^[0-9\b]+$/,
                            })}
                          />
                        </CInputGroup>

                        {/* error for name */}
                        {errors?.services &&
                          errors?.services[index]?.price &&
                          errors?.services[index]?.price?.type ===
                            "required" && (
                            <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                              Price is required
                            </div>
                          )}
                        {errors?.services &&
                          errors?.services[index]?.price &&
                          errors?.services[index]?.price?.type ===
                            "pattern" && (
                            <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                              Only numbers are allowed
                            </div>
                          )}
                      </CCol>

                      <CCol sm={12} xs={12} md={12} lg={6} xl={6} xxl={6}>
                        <CInputGroup className="mb-4">
                          <CInputGroupText>
                            <CIcon icon={cilDescription} />
                          </CInputGroupText>
                          <CFormTextarea
                            type="text"
                            placeholder="Short Description"
                            {...register(`services[${index}].shortDesc`, {
                              required: true,
                              maxLength: 50,
                            })}
                            rows={2}
                            cols={20}
                          />
                        </CInputGroup>

                        {/* error for name */}
                        {/* {error && error[index]?.shortDesc ? (
                          <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                            {error[index]?.shortDesc}
                          </div>
                        ) : (
                          ""
                        )} */}
                        {errors?.services &&
                          errors?.services[index]?.shortDesc &&
                          errors?.services[index]?.shortDesc?.type ===
                            "required" && (
                            <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                              Short description is required
                            </div>
                          )}
                        {errors?.services &&
                          errors?.services[index]?.shortDesc &&
                          errors?.services[index]?.shortDesc?.type ===
                            "maxLength" && (
                            <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                              max length is 50
                            </div>
                          )}
                      </CCol>
                      <CCol sm={12} xs={12} md={12} lg={6} xl={6} xxl={6}>
                        <CInputGroup className="mb-4">
                          <CInputGroupText>
                            <CIcon icon={cilDescription} />
                          </CInputGroupText>
                          <CFormTextarea
                            type="text"
                            placeholder="Long Description"
                            {...register(`services[${index}].longDesc`, {
                              required: true,
                              maxLength: 100,
                            })}
                            rows={2}
                            cols={20}
                          />
                        </CInputGroup>

                        {/* error for name */}
                        {errors?.services &&
                          errors?.services[index]?.longDesc &&
                          errors?.services[index]?.longDesc?.type ===
                            "required" && (
                            <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                              Long description is required
                            </div>
                          )}
                        {errors?.services &&
                          errors?.services[index]?.longDesc &&
                          errors?.services[index]?.longDesc?.type ===
                            "maxLength" && (
                            <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                              max length is 150
                            </div>
                          )}
                      </CCol>
                      {fields.length > 1 && (
                        <CCol sm={12} xs={12} md={12} lg={6} xl={6} xxl={6}>
                          {/* this button remove service based on index. */}
                          <CButton
                            color="danger"
                            size="sm"
                            id={`removeButton${index}`}
                            type="button"
                            onClick={() => {
                              remove(index);
                            }}
                            className="px-4"
                          >
                            Remove
                          </CButton>
                        </CCol>
                      )}
                    </CRow>
                  );
                })}
              </div>
              <CRow>
                <CCol xs={6} className="text-center">
                  {/* this button use to add business service. */}
                  <CButton
                    size="sm"
                    color="primary"
                    type="button"
                    onClick={() =>
                      append({
                        imgFile: "",
                        price: "",
                        imgName: "",
                        shortDesc: "",
                        longDesc: "",
                      })
                    }
                    className="px-4"
                  >
                    Add Services
                  </CButton>
                </CCol>
                <CCol xs={6} className="text-center">
                  <CButton
                    size="sm"
                    color="primary"
                    type="submit"
                    // onClick={(e) => handleCombineClick(e)}
                    className="px-4"
                  >
                    Save
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

//this object define props which is passed in this component
//this object also specify which data-type of props are passed.
AddBusinessServices.propTypes = {
  viewHeight: PropTypes.number, // Adjust the prop type based on the actual type
  closeModal: PropTypes.func,
};
export default React.memo(AddBusinessServices);

//TODO: when index is > 0 then it will show removce button on first index
