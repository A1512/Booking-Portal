import React, { useState } from "react";
import {
  CButton,
  CContainer,
  CNavbar,
  CNavbarToggler,
  CNavbarBrand,
  CCollapse,
  CNavbarNav,
  CNavItem,
  CNavLink,
  CRow,
  CCol,
  CImage,
  CLink,
} from "@coreui/react";
import { Link } from "react-router-dom";
import KodeTechnolabLogo from "src/assets/images/KodeTechnolab.png";

// this is the defualt page display to user when application start.
const HomePage = () => {
  const [visible, setVisible] = useState(false);
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
            <CNavbarNav className="me-auto mb-2 mb-lg-0">
              {/* <CNavItem>
                <CNavLink href="#" active>
                  Home
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#">Link</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#" disabled>
                  Disabled
                </CNavLink>
              </CNavItem> */}
            </CNavbarNav>
            <CButton color="info">
              <Link className="text-decoration-none text-white" to="/login">
                Log In
              </Link>
            </CButton>
            &nbsp;
            <CButton color="info">
              <Link
                className="text-decoration-none text-white"
                to="/signup-option-page"
              >
                Sign Up
              </Link>
            </CButton>
          </CCollapse>
        </CContainer>
      </CNavbar>
      {/* Body */}

      {/* Body */}
      <CContainer
        fluid
        className="mt-4"
        style={{ backgroundColor: "#f8f9fa", color: "#343a40" }}
      >
        {/* Heading */}
        <CRow className="mt-4">
          <h3>Discover and Book Services</h3>
        </CRow>

        {/* Service Features */}
        <CRow className="mt-4">
          <CCol md="4">
            <div className="text-center">
              <i className="bi bi-calendar-date"></i>{" "}
              {/* Example icon, replace with your icon library */}
              <h5>Easy Scheduling</h5>
              <p>
                Book appointments at your convenience with our easy scheduling
                system.
              </p>
            </div>
          </CCol>
          <CCol md="4">
            <div className="text-center">
              <i className="bi bi-person"></i>{" "}
              {/* Example icon, replace with your icon library */}
              <h5>Qualified Providers</h5>
              <p>
                Connect with qualified service providers offering a wide range
                of services.
              </p>
            </div>
          </CCol>
          <CCol md="4">
            <div className="text-center">
              <i className="bi bi-shield"></i>{" "}
              {/* Example icon, replace with your icon library */}
              <h5>Secure Booking</h5>
              <p>
                Your information is safe with us. Enjoy secure and worry-free
                bookings.
              </p>
            </div>
          </CCol>
        </CRow>

        {/* Additional Content */}
        <CRow className="mt-4">
          <CCol md="6">
            <img
              src="https://via.placeholder.com/600x400" // Replace with your image URL
              alt="Service Image"
              className="img-fluid"
            />
          </CCol>
          <CCol md="6">
            <h4>Our Services</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              tincidunt, quam vel porttitor aliquet, enim orci tincidunt odio,
              vel efficitur ligula nisi vel augue.
            </p>
            <CButton color="primary">Learn More</CButton>
          </CCol>
        </CRow>

        {/* Worldwide Customers */}
        <CRow className="mt-4">
          <h4 className="text-center">Our Worldwide Customers</h4>
          {/* Add customer logos/images with appropriate styling */}
          <CCol className="mt-3 text-center" md="3" sm="3" xs="12">
            <img
              src="https://via.placeholder.com/150x100" // Replace with your customer image URL
              alt="Customer 1"
              className="img-fluid"
            />
          </CCol>
          <CCol className="mt-3 text-center" md="3" sm="3">
            <img
              src="https://via.placeholder.com/150x100" // Replace with your customer image URL
              alt="Customer 2"
              className="img-fluid"
            />
          </CCol>
          <CCol className="mt-3 text-center" md="3" sm="3">
            <img
              src="https://via.placeholder.com/150x100" // Replace with your customer image URL
              alt="Customer 3"
              className="img-fluid"
            />
          </CCol>
          <CCol className="mt-3 text-center" md="3" sm="3">
            <img
              src="https://via.placeholder.com/150x100" // Replace with your customer image URL
              alt="Customer 4"
              className="img-fluid"
            />
          </CCol>
        </CRow>

        {/* Call to Action */}
        <CRow className="mt-4">
          <CCol className="text-center">
            <h4>Ready to get started?</h4>
            <p>Join now to explore and book a variety of services.</p>
          </CCol>

          <CCol className="text-center">
            <h4>Register Your Service-Based Business</h4>
            <p>
              Showcase your services and connect with customers. Join our
              platform to grow your business.
            </p>
          </CCol>
        </CRow>
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
            Kode Technolab &nbsp;
          </CLink>
          All Rights Reserved.
        </p>
      </footer>
    </>
  );
};

export default HomePage;
