import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilInbox } from "@coreui/icons";

//this page display to customer or business so that they can change password.
const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });
  const navigate = useNavigate();

  const handleFormSubmit = async (data, event) => {
    event.preventDefault();
    try {
      const url = `${process.env.REACT_APP_API_URL}forgotAccountPassword`;
      const response = await axios.post(url, data);

      //if res.status 200 then password change successfully.
      if (response.status === 200) {
        window.alert("password changed sucessfully!");
        navigate("/login");
      } else {
        console.log("error code", response);
      }
    } catch (err) {
      //if any server side error occur then password not changed.
      window.alert("password not changed!");
      console.log("error", err);
    }
  };
  return (
    <CContainer className=" d-flex align-items-center justify-content-center vh-100 align-items-center">
      <CCard className="p-4" style={{ maxWidth: "400px" }}>
        <CCardBody>
          <CForm onSubmit={handleSubmit(handleFormSubmit)}>
            <h3>Change Your Account Password</h3>
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
                  pattern: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,})$/i,
                })}
              />
            </CInputGroup>
            {errors.emailAddress && errors.emailAddress.type === "required" && (
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
            {errors.emailAddress && errors.emailAddress.type === "pattern" && (
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
                placeholder="New Password"
                name="password"
                id="password"
                autoComplete="current-password"
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
            {/* this is repeat password input so for confirmation purpose we compare both password. */}
            <CInputGroup className="mb-4">
              <CInputGroupText>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type="password"
                placeholder="Repeat password"
                autoComplete="new-password"
                name="repeatNewPassword"
                {...register("repeatNewPassword", {
                  required: true,
                  minLength: 8,
                  maxLength: "passsword".length,
                  validate: (value, formValues) =>
                    formValues.password === value, // Check if it's equal to the 'password' field
                })}
              />
            </CInputGroup>
            {errors.repeatNewPassword &&
              errors.repeatNewPassword.type === "required" && (
                <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                  Repeat password is required
                </div>
              )}
            {errors.repeatNewPassword &&
              (errors.repeatNewPassword.type === "minLength" ||
                errors.repeatNewPassword.type === "maxLength" ||
                errors.repeatNewPassword.type === "validate") && (
                <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                  Both password should be same
                </div>
              )}
            <CRow>
              <div>
                <CButton color="primary" type="submit" className="px-4">
                  Change Password
                </CButton>
              </div>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default ForgotPassword;
