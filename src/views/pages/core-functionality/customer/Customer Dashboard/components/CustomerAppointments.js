import { cilCreditCard } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CContainer,
  CFormInput,
  CRow,
  CCol,
  CButton,
  CFormCheck,
  CModal,
  CModalBody,
  CModalTitle,
  CModalHeader,
} from "@coreui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";

//this component displays user booked appointment.
const CustomerAppointments = () => {
  useEffect(() => {
    getCustomerAppointmentList();
  }, []);
  const navigate = useNavigate();

  //here we get customerID for further use.
  const customerID = useSelector((state) => state.customerID);
  // console.log("customer id", customerID);

  //this variable store customer appointment list.
  const [appointmentList, setAppointmentList] = useState([]);

  //this variable stored filtered data, searched by user.
  const [filterappointmentData, setFilterAppointmentData] = useState([]);

  //this variable store value, entered by user for searching(filter) data.
  const [search, setSearch] = useState("");

  //this variable store state of payment modal, which allows user to select payment mode.
  const [showPaymentTypeModal, setShowPaymentTypeModal] = useState(false);

  //this variable check weather cash payment radio button checked or not.
  const [isCashPaymentChecked, setIsCashPaymentChecked] = useState(false);

  //this function called in useEffect hook, to get user appointment list.
  async function getCustomerAppointmentList() {
    try {
      const customerToken = localStorage.getItem("jwt-token-customer");
      const url = `${process.env.REACT_APP_API_URL}getCustomerAppointmentList`;
      const response = await axios.post(url, customerID, {
        headers: {
          "jwt-token-customer": customerToken,
        },
      });
      if (response.status === 200) {
        // console.log('response', response.data.recordset);
        setAppointmentList(response.data.recordset);
        setFilterAppointmentData(response.data.recordset);
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
  //this hook works to filter result of user search services.
  useEffect(() => {
    const result = appointmentList.filter((data) => {
      return (
        data.business_name?.toLowerCase().match(search.toLowerCase()) ||
        data.service_name?.toLowerCase().match(search.toLowerCase()) ||
        data.price?.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilterAppointmentData(result);
  }, [search]);

  //this is datatable styling object.
  const tableHeaderStyle = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
        backgroundColor: "gray",
      },
    },
  };

  //this is column name of data-table.
  const columns = [
    {
      name: "Customer Name",
      selector: (row) => row.customer_name,
      width: "col col-lg-1",
    },
    {
      name: "Business Name",
      selector: (row) => row.business_name,
      sortable: true,
      width: "col col-lg-1",
    },
    {
      name: "Location",
      selector: (row) => row.business_location,
      width: "col col-lg-1",
    },
    {
      name: "Service Name",
      selector: (row) => row.service_name,
      sortable: true,
      width: "col col-lg-1",
    },
    {
      name: "Price(₹)",
      selector: (row) => row.price,
      sortable: true,
      width: "col col-lg-1",
    },
    {
      name: "Appointment On",
      selector: (row) => {
        const splittingDate = row.date.split("T")[0];
        const formatDate = splittingDate.split("-");
        return formatDate[2] + "-" + formatDate[1] + "-" + formatDate[0];
      },
      width: "col col-lg-1",
    },
    {
      name: "Slot Time",
      selector: (row) => row.slot_time,
      width: "col col-lg-1",
    },
    {
      name: "Booking Status",
      width: "col col-lg-1",
      selector: (row) => (
        <>
          {row.booking_status === "pending" && (
            <p className="text-warning pt-2">{row.booking_status}</p>
          )}
          {row.booking_status === "done" && (
            <p className="text-success pt-2">{row.booking_status}</p>
          )}
          {row.booking_status === "reject" && (
            <p className="text-danger pt-2">{row.booking_status}</p>
          )}
        </>
      ),
    },
    {
      name: "Payment",
      width: "col col-lg-1",
      cell: (row) => (
        <>
          {row.booking_status === "pending" ||
          row.booking_status === "reject" ||
          row.payment_status === "Cash" ||
          row.payment_status === "Done" ? (
            <CIcon
              icon={cilCreditCard}
              size="xl"
              style={{
                cursor: "pointer",
                pointerEvents: "none",
                color: "gray",
              }}
            />
          ) : (
            row.booking_status === "done" &&
            row.payment_status === "Pending" && (
              <>
                <CIcon
                  data-tooltip-id="makePayment"
                  data-tooltip-content="make payment"
                  data-tooltip-place="right"
                  icon={cilCreditCard}
                  size="xl"
                  style={{
                    cursor: "pointer",
                    pointerEvents:
                      row.payment_status === "Done" ? "none" : "auto",
                    color: row.payment_status === "Done" ? "gray" : "blue",
                  }}
                  onClick={() => {
                    setShowPaymentTypeModal(true);
                    localStorage.setItem("service-price", row.price);
                    localStorage.setItem("appointment-id", row.id);
                  }}
                />
                <Tooltip id="makePayment" />
              </>
            )
          )}
        </>
      ),
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <div>
    //       <CIcon
    //         icon={cilPen}
    //         style={{
    //           cursor: "pointer",
    //           pointerEvents: selectedRows.length > 1 ? "none" : "auto",
    //           color: selectedRows.length > 1 ? "gray" : "inherit",
    //         }}
    //         onClick={() => updateSelectedRecord(row)}
    //       ></CIcon>
    //       &nbsp;&nbsp;&nbsp;
    //       <CIcon
    //         icon={cilDelete}
    //         style={{
    //           cursor: "pointer",
    //           pointerEvents: selectedRows.length > 1 ? "none" : "auto",
    //           color: selectedRows.length > 1 ? "gray" : "inherit",
    //         }}
    //         onClick={() => deleteSelectedRecord(row.id, row.name)}
    //       ></CIcon>
    //     </div>
    //   ),
    // },
  ];

  //this function will call when use select cash payment.
  //so we update the payment status in database.
  async function changePaymentStatusOnCashSelectedOption() {
    try {
      const customerToken = localStorage.getItem("jwt-token-customer");
      const url = `${process.env.REACT_APP_API_URL}changePaymentStatusOnCash`;
      const response = await axios.post(
        url,
        {
          appointmentID: localStorage.getItem("appointment-id"),
        },
        {
          headers: {
            "jwt-token-customer": customerToken,
          },
        }
      );
      if (response.status === 200) {
        navigate("/customer-dashboard/homepage/customer/payment-list");
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

  //this function called when use select any option from payment mode.
  //if user select online payment then we redirect user to payment form.
  //if user select cash payment then we update the payment status in database.
  function navigateToCashOrOnlinePayment() {
    if (!isCashPaymentChecked) {
      //navigate to online payment interface
      const confirmation = window.confirm(
        "are you sure want to make payment with online mode"
      );
      if (confirmation) {
        navigate("/customer-dashboard/homepage/slot-booked/customer-payment");
      }
    } else {
      //navigate to cash payment
      const confirmation = window.confirm(
        "are you sure want to make payment with offline mode"
      );
      if (confirmation) {
        changePaymentStatusOnCashSelectedOption();
      }
    }
  }
  return (
    <>
      <CContainer fluid>
        <DataTable
          title="Appointments"
          fixedHeader
          customStyles={tableHeaderStyle}
          columns={columns}
          data={filterappointmentData}
          pagination
          highlightOnHover
          subHeader
          subHeaderComponent={
            <>
              <div className="col-md-6 col-sm-12">
                <CFormInput
                  type="text"
                  placeholder="search by service name or price or business name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </>
          }
          // subHeaderAlign="center"
          // actions={<CButton>Export</CButton>}
        />

        {/* if this condition true then we display modal to give option to user for make payment. */}
        {showPaymentTypeModal && (
          <CModal
            visible={showPaymentTypeModal}
            onClose={() => setShowPaymentTypeModal(false)}
            aria-labelledby="PaymentMode"
          >
            <CModalHeader onClose={() => setShowPaymentTypeModal(false)}>
              <CModalTitle id="PaymentMode">Payment Mode</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow className="mb-3">
                {/* cash payment */}
                <CCol className="col-1">
                  <CFormCheck
                    size={"lg"}
                    type="radio"
                    name="paymentOption"
                    id="cash-payment"
                    checked={isCashPaymentChecked}
                    onChange={() => {
                      setIsCashPaymentChecked(true);
                    }}
                  />
                </CCol>

                <CCol>
                  <span>
                    <h5>Cash Payment</h5>
                  </span>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                {/* online payment */}
                <CCol className="col-1">
                  <CFormCheck
                    size={"lg"}
                    type="radio"
                    name="paymentOption"
                    id="online-payment"
                    checked={!isCashPaymentChecked}
                    onChange={() => {
                      setIsCashPaymentChecked(false);
                    }}
                  />
                </CCol>

                <CCol>
                  <span>
                    <h5>Online Payment</h5>
                  </span>
                </CCol>
              </CRow>
              <CRow className="mb-3 justify-content-center">
                {/* User Registration */}
                <CButton color="info" onClick={navigateToCashOrOnlinePayment}>
                  Next
                </CButton>
              </CRow>
            </CModalBody>
          </CModal>
        )}
      </CContainer>
    </>
  );
};

export default CustomerAppointments;
