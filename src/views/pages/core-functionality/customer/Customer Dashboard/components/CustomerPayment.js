import DataTable from "react-data-table-component";
import React, { useEffect, useState } from "react";
import {
  CButton,
  CContainer,
  CFormInput,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import CIcon from "@coreui/icons-react";
import { cilPen } from "@coreui/icons";
import { Rating } from "react-simple-star-rating";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";

//this component display payments list of user.
const CustomerPayment = () => {
  useEffect(() => {
    getCustomerPayment();
  }, []);

  const navigate = useNavigate();

  //we take customerID for further use.
  const customerID = useSelector((state) => state.customerID.value);

  //this state variable stored payment list which we get from database.
  const [paymentList, setPaymentList] = useState([]);

  //this state variable filter user data searched by user.
  const [filterPaymentData, setFilterPaymentData] = useState([]);

  //this variable stores value entered by user.
  const [search, setSearch] = useState("");

  //this hook works to filter result of user search services.
  useEffect(() => {
    const result = paymentList.filter((data) => {
      return (
        data.business_name?.toLowerCase().match(search.toLowerCase()) ||
        data.service_name?.toLowerCase().match(search.toLowerCase()) ||
        data.service_price?.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilterPaymentData(result);
  }, [search]);

  //this function called in useEffect hook to get customer payment list from database.
  async function getCustomerPayment() {
    try {
      const customerToken = localStorage.getItem("jwt-token-customer");
      const url = `${process.env.REACT_APP_API_URL}getPaymentList`;
      const response = await axios.post(
        url,
        {
          customerID: customerID,
        },
        {
          headers: {
            "jwt-token-customer": customerToken,
          },
        }
      );
      if (response.status === 200) {
        // console.log('response', response.data.recordset);
        setPaymentList(response.data.recordset);
        setFilterPaymentData(response.data.recordset);
      } else {
        console.log(response.statusText);
      }
    } catch (err) {
      if (err.response.status === 401) {
        // window.alert(e.response.statusText);
        navigate("/login");
      } else {
      }
      console.log("err", err);
    }
  }

  //this is datatable styling object we passed in datatable.
  const tableHeaderStyle = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
        backgroundColor: "gray",
      },
    },
  };

  //this variable stores state of customer review modal.
  const [customerReviewModal, setCustomerReviewModal] = useState(false);

  //this state variable store user feedback & rating.
  const [rating, setRating] = useState({
    number: 0,
    feedback: "",
  });

  //this function handle rating given by user.
  async function handleRating() {
    console.log("reviews details", rating);
    setCustomerReviewModal(false);
    const getCustomerFeedbackInfoFromLocalStorage = localStorage.getItem(
      "customerFeedbackInfo"
    );
    const parsedCustomerFeedbackInfo = JSON.parse(
      getCustomerFeedbackInfoFromLocalStorage
    );
    const ratingInformation = {
      customer_id: parsedCustomerFeedbackInfo.cusId,
      customer_name: parsedCustomerFeedbackInfo.cusName,
      business_id: parsedCustomerFeedbackInfo.busId,
      business_name: parsedCustomerFeedbackInfo.busName,
      service_name: parsedCustomerFeedbackInfo.serviceName,
      rating_number: rating.number,
      feedback: rating.feedback,
    };

    try {
      const customerToken = localStorage.getItem("jwt-token-customer");
      const url = `${process.env.REACT_APP_API_URL}feedbackFromCustomer`;
      const response = await axios.post(url, ratingInformation, {
        headers: {
          "jwt-token-customer": customerToken,
        },
      });
      if (response.status === 200) {
        window.alert(response.data.message);
      }
    } catch (e) {
      console.log("error from server", e);
      if (e.response.status === 401) {
        // window.alert(e.response.statusText);
        navigate("/login");
      }
    }
  }

  //this object store user information store in local storage.
  let customerFeedbackInfo = {};

  //this list define column name in data table.
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
      name: "Service Name",
      selector: (row) => row.service_name,
      sortable: true,
      width: "col col-lg-1",
    },
    {
      name: "Price(₹)",
      selector: (row) => row.service_price,
      sortable: true,
      width: "col col-lg-1",
    },
    {
      name: "Payment",
      width: "col col-lg-1",
      selector: (row) => (
        <>
          {row.payment_status === "Pending" && (
            <p className="text-warning pt-2">{row.payment_status}</p>
          )}
          {row.payment_status === "Cash" && (
            <p className="text-info pt-2">{row.payment_status}</p>
          )}
          {row.payment_status === "Done" && (
            <p className="text-success pt-2">{row.payment_status}</p>
          )}
        </>
      ),
    },
    {
      name: "Reviews",
      selector: (row) => (
        <>
          {row.payment_status === "Done" ? (
            <>
              <CIcon
                icon={cilPen}
                data-tooltip-id="customerReview"
                data-tooltip-content="give feedback"
                data-tooltip-place="right"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  customerFeedbackInfo = {
                    busId: row.business_id,
                    busName: row.business_name,
                    cusId: row.customer_id,
                    cusName: row.customer_name,
                    serviceName: row.service_name,
                  };
                  localStorage.setItem(
                    "customerFeedbackInfo",
                    JSON.stringify(customerFeedbackInfo)
                  );
                  setCustomerReviewModal(true);
                }}
              />
              <Tooltip id="customerReview" />
            </>
          ) : (
            <CIcon
              icon={cilPen}
              style={{
                cursor: "pointer",
                color: "gray",
                pointerEvents: "none",
              }}
            />
          )}
        </>
      ),
      sortable: true,
      width: "col col-lg-1",
    },
  ];
  return (
    <>
      <CContainer fluid>
        <DataTable
          title="Your Payments"
          fixedHeader
          customStyles={tableHeaderStyle}
          columns={columns}
          data={filterPaymentData}
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
        />

        {/* when this condition true then we open modal to take feedback from user. */}
        {customerReviewModal && (
          <CModal
            visible={customerReviewModal}
            onClose={() => setCustomerReviewModal(false)}
            aria-labelledby="LiveDemoExampleLabel"
          >
            <CModalHeader onClose={() => setCustomerReviewModal(false)}>
              <CModalTitle id="LiveDemoExampleLabel">
                Service Feedback
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <Rating
                onClick={(e) => setRating({ ...rating, number: e })}
                /* Available Props */
              />
              <hr />
              <CFormTextarea
                rows={2}
                cols={10}
                placeholder="send feedback"
                // style={{ fontStyle: "italic" }}
                onChange={(e) =>
                  setRating({ ...rating, feedback: e.target.value })
                }
              />
              <br />
              <CButton
                className="float-end"
                type="button"
                onClick={handleRating}
              >
                Send Feedback
              </CButton>
            </CModalBody>
          </CModal>
        )}
      </CContainer>
    </>
  );
};

export default CustomerPayment;
