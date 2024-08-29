import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CImage,
  CRow,
  CCardTitle,
  CCardText,
  CModal,
  CModalHeader,
  CModalBody,
  CButton,
  CModalFooter,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CLink,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AppointmentImage1 from "src/assets/images/image.jpg";
import CssFile from "./index.css";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilLocationPin } from "@coreui/icons";
import { useDispatch } from "react-redux";
import { getBusinessessToShowCustomer } from "src/redux-features/reducers/BusinessCardToCusByBusCat";
import { useNavigate } from "react-router-dom";

//this component is for if there is exist businesses or not on user location.
const GetBusinessessByCustomerLocationModal = React.memo(
  ({ businessCategoryId, businessListModal, userEnteredLocation }) => {
    //this boolean state variable is used for if business not found then we display this modal.
    const [showModal, setShowModal] = useState(false);

    //this state variable store business list from we got from server.
    const [businessList, setBusinessList] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //get businesses by user entered location.
    useEffect(() => {
      console.log("Debounced value:", userEnteredLocation);
      // Use Nominatim endpoint for geocoding
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${userEnteredLocation}`;
      axios
        .get(nominatimUrl)
        .then((response) => {
          const data = response.data;
          if (data.length > 0) {
            const { lat, lon } = data[0];
            console.log("Latitude:", lat, "Longitude:", lon);
            const customerToken = localStorage.getItem("jwt-token-customer");
            const url = `${process.env.REACT_APP_API_URL}businessListByCurrentLocation`;
            // we pass latitude & longitude with businessID to server to get businesses list of that location.
            axios
              .post(
                url,
                {
                  latitude: lat,
                  longitude: lon,
                  businessCategoryID: businessCategoryId,
                },
                {
                  headers: {
                    "jwt-token-customer": customerToken,
                  },
                }
              )
              .then((busList) => {
                if (busList.status === 200) {
                  console.log("busines list by location", busList);
                  if (busList.data.recordset.length === 0) {
                    //if business not exist then we show modal that "no business found."
                    setShowModal(true);
                  } else {
                    //we store business list in state variable
                    setBusinessList(busList.data.recordset);

                    // we also stored business list in gloable state so we can access from diffrent component.
                    dispatch(
                      getBusinessessToShowCustomer(busList.data.recordset)
                    );
                  }
                } else {
                  console.log(busList.statusText);
                }
              })
              .catch((e) => {
                if (e.response.status === 401) {
                  // window.alert(e.response.statusText);
                  navigate("/login");
                }
              });
          } else {
            console.log("No Latitude Longitude Found");
          }
        })
        .catch((error) => {
          console.error("Error fetching coordinates:", error);
        });
    }, [userEnteredLocation]);

    useEffect(() => {
      //if we got business list then we navigate user to showBusinessesCard component
      if (businessList.length > 0) {
        // Perform navigation after the component has finished rendering
        navigate("/customer-dashboard/homepage/show-businesses");
      }
    }, [businessList, navigate]);
    return (
      <>
        <CContainer>
          {/* this modal display when there is not business exist at defined location */}
          {showModal && (
            <CModal
              align="center"
              visible={showModal}
              onClose={() => {
                setShowModal(false);
                businessListModal(false);
              }}
            >
              <CModalHeader onClose={() => setShowModal(false)}></CModalHeader>
              <CModalBody>
                <p>Aw Snap!☹ No Businessess Found</p>
              </CModalBody>
              <CModalFooter>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setShowModal(false);
                    businessListModal(false);
                  }}
                >
                  Close
                </CButton>
              </CModalFooter>
            </CModal>
          )}
        </CContainer>
      </>
    );
  }
);

GetBusinessessByCustomerLocationModal.propTypes = {
  businessCategoryId: PropTypes.number,
  businessListModal: PropTypes.func,
  userEnteredLocation: PropTypes.string,
};

GetBusinessessByCustomerLocationModal.displayName =
  "GetBusinessessByCustomerLocationModal";

//other component

//when customer logged in then this page is display to customer
const ServiceCategories = () => {
  const navigate = useNavigate();

  //this state variable to store business categories.
  const [businessCategories, setBusinessCategories] = useState([]);

  //this state varible store latitude & longitudde of current location.
  const [position, setPosition] = useState({ latitude: null, longitude: null });

  //this is boolean state variable handle modal if business found in entered location or not.
  const [businessListModalByLocation, setBusinessListModalByLocation] =
    useState(false);

  //this state variable store business category id so we if user select any category then we can fetch businesess from that category.
  const [storedBusinessCategoryID, setStoredBusinessCategoryID] = useState(0);

  //we use react-redux feature useSelector hook to fetch customer id from globle state.
  const CustomerID = useSelector((state) => state.customerID);
  console.log("customer id", CustomerID);

  //we use react-hook-form to set current location in searchbar & watch user entered value.
  const { register, reset, getValues, watch, setValue } = useForm();
  const watchCurrentLocation = getValues("currentLocation");
  const valueOfCurrentLocation = watch("currentLocation");

  // let getBusinessInfoByID = [];
  useEffect(() => {
    getBusinessCategories();
  }, []);

  //get current location latitude & longitude.
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);

  useEffect(() => {
    const storedLocation = localStorage.getItem("currentLocation");
    setValue("currentLocation", storedLocation);
  }, []);

  //get current location on component load.
  async function getCurrentLocation() {
    try {
      console.log("location position", position);
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.latitude}&lon=${position.longitude}`;
      const getLocation = await axios.get(url);
      console.log("geolocation", getLocation);
      const { data } = getLocation;
      const { address } = data;
      const { town } = address;
      console.log(getLocation);
      reset({
        currentLocation: town,
      });
    } catch (e) {
      console.log("err", e);
    }
  }

  //when first time component load then business categories {dropdown} value will be bind in select business categories.
  async function getBusinessCategories() {
    try {
      const customerToken = localStorage.getItem("jwt-token-customer");
      const url = `${process.env.REACT_APP_API_URL}businessCategories`;
      const response = await axios.get(url, {
        headers: {
          "jwt-token-customer": customerToken,
        },
      });
      // console.log('form values', inputValue);
      if (response.status === 200) {
        setBusinessCategories(response.data.recordset);
        // console.log('Business Categories', response.data.recordset);
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

  //when user click on any business category then first check if he enter any location.
  //if location is not there then we display alert message to choose location.
  //we stored business category id & open modal if any business is there on this location or not.
  //we stored user entered location in localstorage for further use.
  function getBusinessCategoryID(e) {
    if (valueOfCurrentLocation) {
      console.log("div clicked", e);
      setStoredBusinessCategoryID(e);
      setBusinessListModalByLocation(true);
      localStorage.setItem("currentLocation", valueOfCurrentLocation);
    } else {
      alert("choose location first");
    }
  }
  return (
    <>
      <CContainer fluid>
        <CRow>
          <h2>Book Your Appointments</h2>
          <CRow>
            <CCol className="col-7">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  name="currentLocation"
                  {...register("currentLocation")}
                  placeholder="Enter area, city"
                />
              </CInputGroup>
            </CCol>
            <CCol className="col-5 d-flex align-items-center">
              <CLink
                onClick={() => {
                  getCurrentLocation();
                }}
                style={{ textDecoration: "none", cursor: "pointer" }}
              >
                {/* on click this text user got current location. user can edit in input text also */}
                <CIcon icon={cilLocationPin} />
                use current location
              </CLink>
            </CCol>
          </CRow>
          {position.latitude && position.longitude ? (
            <p>
              Latitude: {position.latitude}, Longitude: {position.longitude}
            </p>
          ) : (
            <p>Loading...</p>
          )}
          <br />
          <br />
          <CCol sm={100} md={6}>
            <CCard>
              <CCardBody>
                <CCardTitle className="pb-3">
                  What are you looking for?
                </CCardTitle>
                {/* this container display different categories of business */}
                <CContainer
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignContent: "center",
                  }}
                >
                  {businessCategories.map((value, index) => {
                    if (value.id === -1) {
                      return null;
                    }
                    return (
                      <div
                        className="imageShadow"
                        key={index}
                        style={{ flex: "0 0 calc(33.33% - 20px)" }}
                      >
                        <CImage
                          align="center"
                          src={value.icon}
                          alt={value.name}
                          id={`servicesImageWithName${value.id}`}
                          height={50}
                          width={50}
                          onClick={() => getBusinessCategoryID(value.id)}
                        />
                        <CCardText className="text-center">
                          {value.name}
                        </CCardText>
                        <br />
                      </div>
                    );
                  })}
                </CContainer>
              </CCardBody>
            </CCard>
            <br />
            <CRow>
              <CCol>
                <CRow className="justify-content-between px-1">
                  <CCol className="col-2">
                    <CImage
                      style={{
                        padding: "10px",
                        borderRadius: "10px",
                        backgroundColor: "#202324",
                      }}
                      src="https://cdn-icons-png.flaticon.com/512/3163/3163742.png "
                      alt="rating"
                      height={60}
                      width={60}
                    />
                  </CCol>
                  <CCol className="col-8">
                    <p
                      style={{
                        fontSize: "22px",
                        fontWeight: "500",
                        lineHeight: "25px",
                      }}
                    >
                      4.5
                    </p>
                    <p
                      style={{ lineHeight: "16px" }}
                      className="text-wrap overflow-wrap"
                    >
                      Service Rating
                    </p>
                  </CCol>
                </CRow>
              </CCol>
              <CCol>
                <CRow className="justify-content-between px-1">
                  <CCol className="col-2">
                    <CImage
                      style={{
                        padding: "10px",
                        borderRadius: "10px",
                        backgroundColor: "#202324",
                      }}
                      src="   https://cdn-icons-png.flaticon.com/512/1357/1357616.png "
                      alt="rating"
                      height={60}
                      width={60}
                    />
                  </CCol>

                  <CCol className="col-8">
                    <p
                      style={{
                        fontSize: "22px",
                        fontWeight: "500",
                        lineHeight: "25px",
                      }}
                    >
                      100K+
                    </p>
                    <p style={{ lineHeight: "16px" }}>Customers Globally</p>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
          </CCol>
          <CCol sm={100} md={6}>
            <CImage
              fluid
              rounded
              src={AppointmentImage1}
              alt="show categories"
            />
          </CCol>
        </CRow>
      </CContainer>

      {/* if this condition is true then GetBusinessessByCustomerLocationModal component called */}
      {businessListModalByLocation && (
        <GetBusinessessByCustomerLocationModal
          businessCategoryId={storedBusinessCategoryID}
          businessListModal={() => setBusinessListModalByLocation(false)}
          userEnteredLocation={watchCurrentLocation}
        />
      )}
    </>
  );
};

export default ServiceCategories;
