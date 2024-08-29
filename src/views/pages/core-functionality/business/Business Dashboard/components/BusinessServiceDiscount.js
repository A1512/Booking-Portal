import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

const BusinessServiceDiscount = ({ onClose }) => {
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
  });
  //this is handle form submisssion, business add discount in service.
  const handleFormSubmit = async (data) => {
    console.log("discount data", data);
    debugger;
    if (isValid) {
      try {
        const getDataOfDiscount = localStorage.getItem(
          "dataForDiscountOnService"
        );
        const parsedDiscountInfo = JSON.parse(getDataOfDiscount);
        const storeServiceDiscountData = {
          serviceID: parsedDiscountInfo.serviceId,
          serviceName: parsedDiscountInfo.serviceName,
          businessID: parsedDiscountInfo.busID,
        };
        const finalDataToSend = { ...storeServiceDiscountData, ...data };
        console.log(
          "final data for apply discoutn on business",
          finalDataToSend
        );
        const businessToken = localStorage.getItem("jwt-token-business");
        const url = `${process.env.REACT_APP_API_URL}applyDiscountOnBusinessService`;
        const response = await axios.post(url, finalDataToSend, {
          headers: {
            "jwt-token-business": businessToken,
          },
        });
        if (response.status === 200) {
          //if response status is success then we display alert message to user that your request has been sent to business for confirmation.
          // navigate user to appointment page.
          console.log("response flag", response);
          window.alert(response.data.message);
          onClose();
        } else {
          window.alert(response.data.message);
        }
      } catch (err) {
        if (err.response.status === 401) {
          // window.alert(e.response.statusText);
          navigate("/login");
        } else {
          console.log("error", err);
        }
      }
    }
  };
  return (
    <>
      <CForm onSubmit={handleSubmit(handleFormSubmit)}>
        <CRow>
          <CCol>
            <CInputGroup className="mb-3">
              <CInputGroupText>
                <span>Start Date</span>
              </CInputGroupText>
              <CFormInput
                className="form-control"
                name="startDate"
                type="date"
                {...register("startDate", {
                  required: true,
                })}
              />
            </CInputGroup>

            {errors.startDate && errors.startDate?.type === "required" && (
              <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                start date is required
              </div>
            )}
          </CCol>
          <CCol>
            <CInputGroup className="mb-3">
              <CInputGroupText>
                <span>End Date</span>
              </CInputGroupText>
              <CFormInput
                className="form-control"
                name="endDate"
                type="date"
                {...register("endDate", {
                  required: true,
                  validate: (value, formValues) =>
                    new Date(value) >= new Date(formValues.startDate) ||
                    "end date must be greater than start date.",
                })}
              />
            </CInputGroup>
            {errors.endDate && errors.endDate?.type === "required" && (
              <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                end date is required
              </div>
            )}
            {errors.endDate && errors.endDate?.type === "validate" && (
              <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                {errors.endDate.message}
              </div>
            )}
          </CCol>
          <CCol>
            <CInputGroup className="mb-3">
              <CInputGroupText>
                <span>Discount</span>
              </CInputGroupText>
              <CFormInput
                placeholder="percentage value"
                name="discount"
                type="text"
                autoComplete="0"
                {...register("discount", {
                  required: true,
                  pattern: /^([1-9]|[1-9][0-9]|100)$/,
                })}
              />
            </CInputGroup>
            {/* error for discount value */}
            {errors.discount && errors.discount?.type === "required" && (
              <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                discount is required
              </div>
            )}
            {errors.discount && errors.discount?.type === "pattern" && (
              <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                only 1-100 numbers are allowed
              </div>
            )}
          </CCol>
        </CRow>
        <CButton color="primary" type="submit" className="px-4 float-end">
          Apply Discount
        </CButton>
      </CForm>
    </>
  );
};
BusinessServiceDiscount.propTypes = {
  onClose: PropTypes.func,
};
export default BusinessServiceDiscount;
