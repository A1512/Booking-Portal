import { useSelector } from "react-redux";
// import DataTable from "react-data-table-component";
import React, { useEffect, useState } from "react";
import {
  CForm,
  CCol,
  CInputGroup,
  CInputGroupText,
  CCardImage,
  CCardTitle,
  CListGroup,
  CListGroupItem,
  CBadge,
  CButton,
  CCard,
  CContainer,
  CFormTextarea,
  CRow,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CFormInput,
  CAlert,
} from "@coreui/react";
import TimePicker from "react-bootstrap-time-picker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilArrowRight, cilCalendar } from "@coreui/icons";
import ShowBusinessServiceFilter from "./ShowBusinessServiceFilter";
import { Rating } from "react-simple-star-rating";

//this page is show business services to user that user can book their appointment.
const ShowBusinessServices = () => {
  const navigate = useNavigate();

  // we fetch customer id from globle state so we can use further.
  const cusID = useSelector((state) => state.customerID.value);

  // we fetch business services from globle state, diplay to customer
  const businessServiceList = useSelector(
    (state) => state.businessServicesForCus
  );

  const { value } = businessServiceList;
  const [businessName, setBusinessName] = useState("");
  // console.log("business service list", value);

  useEffect(() => {
    setBusinessName(localStorage.getItem("bNameToShowCustomer"));
  }, []);
  //this state variable use for store datemodal status if true so its visible to user.
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [showServiceInfoModal, setShowServiceInfoModal] = useState(false);
  const [businessServicesInfo, setBusinessServicesInfo] = useState({});
  //this function take id from particular business service & get that service information
  async function getBusinessServiceInformation(serviceID) {
    try {
      const customerToken = localStorage.getItem("jwt-token-customer");
      const url = `${process.env.REACT_APP_API_URL}getBusinessServices`;
      const response = await axios.post(
        url,
        { value: serviceID, flag: 1 },
        {
          headers: {
            "jwt-token-customer": customerToken,
          },
        }
      );
      if (response.status === 200) {
        // console.log('response', response.data.recordset);
        setBusinessServicesInfo(response.data.recordset[0]);
        setShowServiceInfoModal(true);
        console.log(
          "service info modal to customer",
          response.data.recordset[0]
        );
      } else {
        console.log(response.statusText);
      }
    } catch (e) {
      console.log("Error occur while getting busines service info", e);
    }
  }
  //this variable is for to filter data, search by user
  // const [filterBusinessServiceData, setFilterBusinessServiceData] = useState(
  //   []
  // );

  //this varible store slotTime & slotDate selected by user.
  const [timeAndDate, setTimeAndDate] = useState({
    slotTime: "10:00",
    slotDate: new Date(),
  });

  function bookSlot(businessID, name, serviceID, price) {
    debugger;
    let appointmentInfo = {
      businessID: businessID,
      selectedServiceName: name,
      selectedServiceID: serviceID,
      servicePrice: price,
    };
    localStorage.setItem("appointmentInfo", JSON.stringify(appointmentInfo));
    setShowDateTimeModal(true);
  }
  //convert seconds to hour:mm
  const secondsToHHMM = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return `${formattedHours}:${formattedMinutes}`;
  };

  //this is handle form submisssion user slot request is sent to business for confirmation.
  const handleFormSubmit = async () => {
    try {
      const getAppointmentInfo = localStorage.getItem("appointmentInfo");
      const parsedAppointmentInfo = JSON.parse(getAppointmentInfo);
      console.log("slot time & date", timeAndDate);
      const cusAndBusID = {
        customerID: cusID,
        businessID: parsedAppointmentInfo.businessID,
        serviceName: parsedAppointmentInfo.selectedServiceName,
        serviceID: parsedAppointmentInfo.selectedServiceID,
        price: parsedAppointmentInfo.servicePrice,
      };
      const finalDataToSend = { ...cusAndBusID, ...timeAndDate };
      setTimeAndDate({
        slotTime: "10:00",
        slotDate: new Date(),
      });

      // when user click book slot button then we closed the modal.
      setShowDateTimeModal(false);
      const customerToken = localStorage.getItem("jwt-token-customer");
      const url = `${process.env.REACT_APP_API_URL}bookAppointment`;
      const response = await axios.post(url, finalDataToSend, {
        headers: {
          "jwt-token-customer": customerToken,
        },
      });
      if (response.status === 200) {
        //if response status is success then we display alert message to user that your request has been sent to business for confirmation.
        // navigate user to appointment page.
        console.log("response flag", response);
        window.alert(response.data.message);
        if (
          response.data.message ===
          "Request is Sent to Business for Confirmation"
        ) {
          navigate("/customer-dashboard/homepage/booked-appointments");
        }
      } else if (response.status === 201) {
        //if response status 201 then this slot is already booked
        window.alert(response.data.message);
      } else {
        console.log("error code", response);
      }
    } catch (err) {
      if (err.response.status === 401) {
        // window.alert(e.response.statusText);
        navigate("/login");
      } else {
        console.log("error", err);
        window.alert("Slot Not Available");
      }
    }
  };

  return (
    <>
      <CContainer fluid>
        <div className="text-center">
          <h1>Explore Services of {businessName}</h1>
        </div>

        <CRow>
          <CCol xs={2} sm={2} md={4} lg={3} xxl={2}>
            <ShowBusinessServiceFilter />
          </CCol>
          <CCol xs={10} sm={10} md={8} lg={8} xxl={10}>
            {/* this is business list display to user */}
            <CRow className="row p-2">
              {value ? (
                <>
                  {value.map((value, index) => (
                    <React.Fragment key={index}>
                      <CCard
                        className="mx-2"
                        style={{ width: "15rem", padding: "5px" }}
                      >
                        {value.imageURL.includes("mp4") ? (
                          <video width="auto" height={200} controls>
                            <source src={value.imageURL} />
                          </video>
                        ) : (
                          <CCardImage
                            orientation="top"
                            src={value.imageURL}
                            height={200}
                            width={80}
                            alt="business image"
                          />
                        )}
                        <CCardTitle>{value.name}</CCardTitle>

                        <CListGroup>
                          {value.discount_percentage ? (
                            <CListGroupItem className="d-flex justify-content-between align-items-center">
                              Price
                              <CBadge
                                color="primary"
                                style={{ borderRadius: "none" }}
                              >
                                <del>₹ {value.price}</del>{" "}
                                <span>{value.discount_percentage}% off</span>
                              </CBadge>
                            </CListGroupItem>
                          ) : (
                            <CListGroupItem className="d-flex justify-content-between align-items-center">
                              Price
                              <CBadge
                                color="primary"
                                style={{ borderRadius: "none" }}
                              >
                                ₹ {value.price}
                              </CBadge>
                            </CListGroupItem>
                          )}
                          {value.avg_rating_number && (
                            <CListGroupItem className="d-flex justify-content-between align-items-center">
                              Customer Review
                              <CBadge
                                color="primary"
                                style={{ borderRadius: "none" }}
                              >
                                <Rating
                                  size={20}
                                  readonly
                                  initialValue={value.avg_rating_number}
                                />
                              </CBadge>
                            </CListGroupItem>
                          )}
                          {value.discount_percentage && (
                            <CListGroupItem className="d-flex justify-content-between align-items-center">
                              Discounted Price
                              <CBadge
                                color="primary"
                                style={{ borderRadius: "none" }}
                              >
                                ₹{" "}
                                {Math.round(
                                  value.price -
                                    (value.price * value.discount_percentage) /
                                      100
                                )}
                              </CBadge>
                            </CListGroupItem>
                          )}
                          <CListGroupItem className="d-flex justify-content-between align-items-center">
                            More Info
                            <CBadge
                              onClick={() =>
                                getBusinessServiceInformation(value.id)
                              }
                              color="primary"
                              style={{
                                borderRadius: "none",
                                cursor: "pointer",
                              }}
                            >
                              <CIcon icon={cilArrowRight} />
                            </CBadge>
                          </CListGroupItem>
                          {/* when user click on this button, he will be navigate to business services page. */}
                          <CListGroupItem className="d-flex justify-content-center align-items-center">
                            <CButton
                              className="btn btn-sm btn-info"
                              onClick={() => {
                                let originalPrice = value.price;
                                let discountedAmount,
                                  priceAfterDiscount,
                                  finalValueForPayment;
                                if (value.discount_percentage) {
                                  discountedAmount = value.discount_percentage;
                                  priceAfterDiscount = Math.round(
                                    originalPrice -
                                      (originalPrice * discountedAmount) / 100
                                  );
                                }
                                if (priceAfterDiscount) {
                                  finalValueForPayment = priceAfterDiscount;
                                } else {
                                  finalValueForPayment = originalPrice;
                                }

                                bookSlot(
                                  value.business_id,
                                  value.name,
                                  value.id,
                                  finalValueForPayment
                                );
                              }}
                            >
                              <CIcon icon={cilCalendar} />
                              &nbsp; Book Your Appointment
                            </CButton>
                          </CListGroupItem>
                        </CListGroup>
                      </CCard>
                    </React.Fragment>
                  ))}
                </>
              ) : (
                <CAlert color="warning">
                  No Service Found! Change Your Filter
                </CAlert>
              )}
            </CRow>
          </CCol>
          {showServiceInfoModal && (
            <CModal
              visible={showServiceInfoModal}
              onClose={() => setShowServiceInfoModal(false)}
            >
              <CModalHeader onClose={() => setShowServiceInfoModal(false)}>
                <CModalTitle id="LiveDemoExampleLabel">
                  Selected Service Information
                </CModalTitle>
              </CModalHeader>
              <CModalBody>
                <p>
                  <strong>Name</strong>{" "}
                  <CFormInput readOnly value={businessServicesInfo.name} />
                </p>
                <p>
                  <strong>Price</strong>{" "}
                  <CFormInput readOnly value={businessServicesInfo.price} />
                </p>
                <p>
                  <strong>Short Description</strong>{" "}
                  <CFormTextarea
                    rows={3}
                    cols={10}
                    placeholder="short description"
                    readOnly
                    defaultValue={businessServicesInfo.short_description}
                  />
                </p>
                <p>
                  <strong>Long Description</strong>{" "}
                  <CFormTextarea
                    rows={3}
                    cols={10}
                    placeholder="long description"
                    readOnly
                    defaultValue={businessServicesInfo.long_description}
                  />
                </p>
              </CModalBody>
              <CModalFooter>
                <CButton
                  color="secondary"
                  onClick={() => setShowServiceInfoModal(false)}
                >
                  Close
                </CButton>
              </CModalFooter>
            </CModal>
          )}

          {showDateTimeModal && (
            <CModal
              visible={showDateTimeModal}
              onClose={() => setShowDateTimeModal(false)}
            >
              <CModalHeader onClose={() => setShowDateTimeModal(false)}>
                <CModalTitle id="LiveDemoExampleLabel">
                  Book Your Slot
                </CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CForm onSubmit={handleFormSubmit}>
                  <CRow>
                    <CCol>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <span>Select Time</span>
                        </CInputGroupText>
                        <TimePicker
                          name="slotTime"
                          start="00:00"
                          end="23:59"
                          step={30}
                          format={24}
                          placeholder="Select Time"
                          value={timeAndDate.slotTime}
                          onChange={(e) => {
                            setTimeAndDate((prevValue) => ({
                              ...prevValue,
                              slotTime: secondsToHHMM(e),
                            }));
                          }}
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol>
                      <DatePicker
                        name="slotDate"
                        placeholder="select date"
                        className="form-control"
                        selected={timeAndDate.slotDate} // Use watch to get the value
                        onChange={(e) =>
                          setTimeAndDate((prevValue) => ({
                            ...prevValue,
                            slotDate: e,
                          }))
                        }
                      />
                    </CCol>
                  </CRow>
                  <CButton
                    color="primary"
                    type="submit"
                    className="px-4 float-end"
                  >
                    Book Slot
                  </CButton>
                </CForm>
              </CModalBody>
            </CModal>
          )}
        </CRow>
      </CContainer>
    </>
  );
};

export default ShowBusinessServices;

//rough work
{
  /* <CContainer fluid className="mt-2 vh-100"> */
}
{
  /* <CCard>
          <CCardBody>
            <DataTable
              title="Explore Services"
              fixedHeader
              // fixedHeaderScrollHeight="450px"
              customStyles={tableHeaderStyle}
              columns={columns}
              data={filterBusinessServiceData}
              pagination
              highlightOnHover
              subHeader
              subHeaderComponent={
                <>
                  <div className="col-md-6 col-sm-12">
                    <CFormInput
                      name="searchBar"
                      type="text"
                      placeholder="search by service name or price"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </>
              }
            />
          </CCardBody>
        </CCard> */
}

{
  /* this is time & date modal when user wants to book slot then this will open. */
}
{
}
{
  /* </CContainer> */
}

//this is datatable column name with business service data.
// const columns = [
//   {
//     name: "Image",
//     cell: (value) => {
//       return (
//         <CImage
//           src={value.imageURL}
//           thumbnail={true}
//           height={80}
//           width={80}
//           alt="logo"
//         />
//       );
//     },
//     width: "col col-lg-1",
//   },
//   {
//     name: "Service Name",
//     selector: (value) => value.name,
//     sortable: true,
//     width: "col col-lg-1",
//   },
//   {
//     name: "Price(₹)",
//     selector: (value) => value.price,
//     sortable: true,
//     width: "col col-lg-1",
//   },
//   {
//     name: "Short Description",
//     cell: (value) => (
//       <div>
//         <CFormTextarea
//           name="shortDescription"
//           readOnly
//           rows={2}
//           cols={20}
//           value={value.short_description}
//         ></CFormTextarea>
//       </div>
//     ),
//     width: "col col-lg-1",
//   },
//   {
//     name: "Long Description",
//     cell: (value) => (
//       <div>
//         <CFormTextarea
//           name="longDescription"
//           readOnly
//           rows={2}
//           cols={20}
//           value={value.long_description}
//         ></CFormTextarea>
//       </div>
//     ),
//     width: "col col-lg-1",
//   },
//   {
//     name: "Action",
//     cell: (value) => (
//       <div>
//         <CButton
//           className="btn btn-primary btn-sm"
//           onClick={() =>
//             bookSlot(value.business_id, value.name, value.id, value.price)
//           }
//         >
//           Book Your Slot
//         </CButton>
//       </div>
//     ),
//   },
// ];

//this hook called once when component load & store business service to filterBusinessServiceData varible.
// useEffect(() => {
//   setFilterBusinessServiceData(value);
// }, []);

//this hook called when user wants to filter data by searching
// useEffect(() => {
//   const result = value.filter((data) => {
//     return (
//       data.name?.toLowerCase().match(search.toLowerCase()) ||
//       data.price?.toLowerCase().match(search.toLowerCase())
//     );
//   });
//   setFilterBusinessServiceData(result);
// }, [search]);

//this is datatble header style object passed in datatable
// const tableHeaderStyle = {
//   headCells: {
//     style: {
//       fontWeight: "bold",
//       fontSize: "16px",
//       backgroundColor: "gray",
//     },
//   },
// };
