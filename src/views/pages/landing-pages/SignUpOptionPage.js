import React, { useState } from "react";
import {
  CButton,
  CContainer,
  CNavbar,
  CNavbarToggler,
  CNavbarBrand,
  CCollapse,
  CNavbarNav,
  CImage,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CFormCheck,
  CLink,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import KodeTechnolabLogo from "src/assets/images/KodeTechnolab.png";

//this page gives option to user to select what to choose as register..
const SignUpOptionPage = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const [isBusinessChecked, setIsBusinessChecked] = useState(false);

  //this function navigate user to particular register page depends on user selected option.
  const navigateToBusinessOrCustomerPage = () => {
    if (isBusinessChecked) {
      navigate("/business-register");
    } else {
      navigate("/user-register");
    }
  };
  return (
    <>
      <CNavbar expand="lg" colorScheme="light" className="bg-light">
        <CContainer fluid>
          <CNavbarToggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <CNavbarBrand
            href="https://kodetechnolab.com/"
            className="d-none d-md-flex"
            target="_blank"
          >
            <CImage src={KodeTechnolabLogo} width={200} height={40} />
          </CNavbarBrand>
          <CCollapse className="navbar-collapse" visible={visible}>
            {/* in this navbar we put login button so that user can login. */}
            <CNavbarNav className="me-auto mb-2 mb-lg-0"></CNavbarNav>
            <CButton
              color="info"
              onClick={() => {
                navigate("/login");
              }}
            >
              Log In
            </CButton>
          </CCollapse>
        </CContainer>
      </CNavbar>

      {/* Body */}
      <CContainer
        className="mt-4"
        style={{
          backgroundImage:
            'url("https://kodetechnolab.com/wp-content/uploads/2020/11/slide-1.jpg")', // Set your image URL
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "calc(100vh - 56px)", // Subtracting the header height
          filter: "contrast(130%) brightness(100%) opacity(100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* below card gives option to user so user can select one of them option. */}
        <CCard
          style={{
            backgroundColor: "CaptionText",
            filter: "contrast(70%) opacity(80%) brightness(150%)",
            border: "1px solid whitesmoke",
            // height: "auto",
            width: "auto",
          }}
        >
          <CCardBody>
            <h2 className="text-center mb-4 text-light">
              Register Options <hr />
            </h2>
            <CRow className="mb-3">
              {/* Business Registration */}
              <CCol className="col-1">
                <CFormCheck
                  size={"lg"}
                  type="radio"
                  name="registerOption"
                  id="register-business"
                  checked={isBusinessChecked}
                  onChange={() => {
                    setIsBusinessChecked(true);
                  }}
                />
              </CCol>

              <CCol>
                <span>
                  <h5>Register as Business</h5>
                </span>
                <p>Create an account to provide services.</p>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              {/* User Registration */}
              <CCol className="col-1">
                <CFormCheck
                  size={"lg"}
                  type="radio"
                  name="registerOption"
                  id="register-customer"
                  checked={!isBusinessChecked}
                  onChange={() => {
                    setIsBusinessChecked(false);
                  }}
                />
              </CCol>

              <CCol>
                <span>
                  <h5>Register as User</h5>
                </span>
                <p>
                  Create an account to access personalized features and
                  services.
                </p>
              </CCol>
            </CRow>
            <CRow className="mb-3justify-content-center">
              {/* User Registration */}
              <CButton color="info" onClick={navigateToBusinessOrCustomerPage}>
                Next
              </CButton>
            </CRow>
          </CCardBody>
        </CCard>
      </CContainer>

      {/* Footer */}
      <footer className="bg-dark text-light mt-5 py-3 text-center">
        <p>
          &copy; 2025{" "}
          <CLink
            href="https://kodetechnolab.com/"
            className="text-decoration-none text-white"
            target="_blank"
          >
            Kode Technolab
          </CLink>
          . All Rights Reserved.
        </p>
      </footer>
    </>
  );
};

export default SignUpOptionPage;
