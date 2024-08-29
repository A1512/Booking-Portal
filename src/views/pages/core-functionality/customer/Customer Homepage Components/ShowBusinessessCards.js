import {
  CBadge,
  CCard,
  CCardImage,
  CCardTitle,
  CListGroup,
  CListGroupItem,
  CButton,
  CRow,
  CContainer,
} from "@coreui/react";
import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import { getBusinessServiceToShowCustomer } from "src/redux-features/reducers/BusinessServicesForCustomer";
import { useNavigate } from "react-router-dom";

//this component show business list by user defined location.
const ShowBusinessessCards = () => {
  //this is react-redux useSelector hook to get business data from globle state.
  const businessList = useSelector((state) => state.businessCard);
  const { value } = businessList;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // this function navigate user to business services page(selected business by user)
  async function navigateToBusinessServicePage(businessID, bName) {
    try {
      const customerToken = localStorage.getItem("jwt-token-customer");
      const url = `${process.env.REACT_APP_API_URL}getBusinessServices`;
      localStorage.setItem("bIdToGetFilterBusinessService", businessID);
      localStorage.setItem("bNameToShowCustomer", bName);
      const response = await axios.post(
        url,
        { value: businessID, flag: null },
        {
          headers: {
            "jwt-token-customer": customerToken,
          },
        }
      );
      if (response.status === 200) {
        //we stored business services for selected business in globle state. & navigate user to business services page
        console.log("business services of selected business", response);
        dispatch(getBusinessServiceToShowCustomer(response.data.recordset));
        navigate("/customer-dashboard/homepage/business-services");
      } else {
        alert(response.data.message);
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
  return (
    <>
      <CContainer fluid>
        <div className="text-center">
          <h1>Explore Businesses</h1>
        </div>
        {/* this is business list display to user */}
        <CRow className="row p-5">
          {value.map((value, index) => (
            <React.Fragment key={index}>
              <CCard
                className="mx-2"
                style={{ width: "17rem", padding: "5px" }}
              >
                <CCardImage
                  orientation="top"
                  src={value.imgURL}
                  height={150}
                  width={80}
                  alt="business image"
                />
                <CCardTitle>{value.name}</CCardTitle>

                <CListGroup>
                  <CListGroupItem className="d-flex justify-content-between align-items-center">
                    Email
                    <CBadge color="primary" style={{ borderRadius: "none" }}>
                      {value.email}
                    </CBadge>
                  </CListGroupItem>
                  <CListGroupItem className="d-flex justify-content-between align-items-center">
                    Open Hours
                    <CBadge color="primary" style={{ borderRadius: "none" }}>
                      {value.hour}
                    </CBadge>
                  </CListGroupItem>
                  <CListGroupItem className="d-flex justify-content-between align-items-center">
                    Location
                    <CBadge color="primary" style={{ borderRadius: "none" }}>
                      {value.location}
                    </CBadge>
                  </CListGroupItem>
                  <CListGroupItem className="d-flex justify-content-between align-items-center">
                    Week Days
                    <span>
                      <CBadge color="primary" style={{ borderRadius: "none" }}>
                        {value.week_day}
                      </CBadge>
                    </span>
                  </CListGroupItem>
                  <CListGroupItem className="d-flex justify-content-between align-items-center">
                    Phone Number
                    <span>
                      <CBadge color="primary" style={{ borderRadius: "none" }}>
                        {value.phone_no}
                      </CBadge>
                    </span>
                  </CListGroupItem>
                  {/* when user click on this button, he will be navigate to business services page. */}
                  <CListGroupItem className="d-flex justify-content-end align-items-center">
                    <CButton
                      className="btn btn-sm btn-info"
                      onClick={() =>
                        navigateToBusinessServicePage(value.id, value.name)
                      }
                    >
                      Explore Services
                    </CButton>
                  </CListGroupItem>
                </CListGroup>
              </CCard>
            </React.Fragment>
          ))}
        </CRow>
      </CContainer>
    </>
  );
};
ShowBusinessessCards.propTypes = {
  busList: PropTypes.array,
};
export default ShowBusinessessCards;
