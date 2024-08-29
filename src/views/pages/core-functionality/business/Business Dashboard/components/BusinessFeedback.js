import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import axios from "axios";
import CIcon from "@coreui/icons-react";
import { Tooltip } from "react-tooltip";
import { cilEnvelopeClosed } from "@coreui/icons";
import { Rating } from "react-simple-star-rating";
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
import { useNavigate } from "react-router-dom";

//this component display feedback from customer for business.
const BusinessFeedback = () => {
  // using useSelector hook we get businessID for further use.
  const businessID = useSelector((state) => state.businessID.value);
  const navigate = useNavigate();

  //this hook will bring customer feedback list for business for once when component called.
  useEffect(() => {
    getCustomerFeedbackList();
  }, []);

  //this state variable stores feedback list from database.
  const [feedbackList, setFeedbackList] = useState([]);

  //this state varible stored filtered data searched by user.
  const [filterFeedbackList, setFilterFeedbackList] = useState([]);

  //this state variable stored value which entred by user to search feedback data.
  const [search, setSearch] = useState("");

  //this object stored style of datatable
  const tableHeaderStyle = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
        backgroundColor: "gray",
      },
    },
  };

  //this function called in useEffect hook
  async function getCustomerFeedbackList() {
    try {
      const businessToken = localStorage.getItem("jwt-token-business");
      const url = `${process.env.REACT_APP_API_URL}getFeedbackListForBusiness`;
      const response = await axios.post(
        url,
        {
          businessID: businessID,
        },
        {
          headers: {
            "jwt-token-business": businessToken,
          },
        }
      );
      if (response.status === 200) {
        // console.log('response', response.data.recordset);
        setFeedbackList(response.data.recordset);
        setFilterFeedbackList(response.data.recordset);
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

  //this state variable shows feedback modal, when business wants to show feedback.
  const [showFeedbackModal, setShowFeedbackModal] = useState({
    showModal: false,
    feedback: "",
    businessResponse: "",
  });
  //this hook works to filter result of user search services.
  useEffect(() => {
    const result = feedbackList.filter((data) => {
      return (
        data.customer_name?.toLowerCase().match(search.toLowerCase()) ||
        data.service_name?.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilterFeedbackList(result);
  }, [search]);

  //this columns list define column name in datatable.
  const columns = [
    {
      name: "Customer Name",
      selector: (row) => row.customer_name,
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
      name: "Rating",
      cell: (row) => (
        <Rating size={20} readonly initialValue={row.rating_number} />
      ),
      sortable: true,
      width: "col col-lg-1",
    },
    {
      name: "Feedback",
      cell: (row) => (
        <div>
          <CIcon
            icon={cilEnvelopeClosed}
            data-tooltip-id="my-tooltip"
            data-tooltip-content="click to see feedback"
            data-tooltip-place="right"
            className="text-info"
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              localStorage.setItem("feedback-id", row.id);
              setShowFeedbackModal({
                ...showFeedbackModal,
                showModal: true,
                feedback: row.feedback,
                businessResponse: row.business_response,
              });
            }}
          />
          <Tooltip id="my-tooltip" />
        </div>
      ),
      width: "col col-lg-1",
    },
    {
      name: "Date",
      selector: (row) => {
        const splittingDate = row.date.split("T")[0];
        const formatDate = splittingDate.split("-");
        return formatDate[2] + "-" + formatDate[1] + "-" + formatDate[0];
      },
      width: "col col-lg-1",
    },
  ];

  //this function will store response for customer from business.
  async function handleBusinessResponse() {
    console.log(showFeedbackModal);
    setShowFeedbackModal((prevValue) => ({
      ...prevValue,
      showModal: false,
    }));
    const responseInformation = {
      feedback_id: localStorage.getItem("feedback-id"),
      resFromBusiness: showFeedbackModal.businessResponse,
    };

    try {
      const businessToken = localStorage.getItem("jwt-token-business");
      const url = `${process.env.REACT_APP_API_URL}storeResponseOfBusinessForCustomer`;
      const response = await axios.post(url, responseInformation, {
        headers: {
          "jwt-token-business": businessToken,
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
  return (
    <>
      <CContainer fluid>
        <DataTable
          title="Customer Feedback"
          fixedHeader
          customStyles={tableHeaderStyle}
          columns={columns}
          data={filterFeedbackList}
          pagination
          highlightOnHover
          subHeader
          subHeaderComponent={
            <>
              <div className="col-md-6 col-sm-12">
                <CFormInput
                  type="text"
                  placeholder="search by service name or customer name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </>
          }
        />

        {/* this condition will open modal to show customer feedback & business can also give them reply */}
        {showFeedbackModal.showModal && (
          <CModal
            visible={showFeedbackModal.showModal}
            onClose={() =>
              setShowFeedbackModal({ ...showFeedbackModal, showModal: false })
            }
          >
            <CModalHeader
              onClose={() =>
                setShowFeedbackModal({ ...showFeedbackModal, showModal: false })
              }
            >
              <CModalTitle>Customer Review</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CContainer>
                <div className="col-8 float-start">
                  <CFormTextarea
                    rows={2}
                    cols={10}
                    readOnly
                    value={showFeedbackModal.feedback}
                  />
                </div>
                <br />
                <br />
                <br />
                <div className="col-7 float-end">
                  <CFormTextarea
                    rows={1}
                    cols={10}
                    placeholder="send response to customer"
                    defaultValue={showFeedbackModal.businessResponse}
                    // style={{ fontStyle: "italic" }}
                    onChange={(e) =>
                      setShowFeedbackModal({
                        ...showFeedbackModal,
                        businessResponse: e.target.value,
                      })
                    }
                  />
                  <div className="float-end" style={{ marginTop: "5px" }}>
                    <CButton
                      type="button"
                      className="btn btn-sm"
                      onClick={handleBusinessResponse}
                    >
                      Send Response
                    </CButton>
                  </div>
                </div>
              </CContainer>
            </CModalBody>
          </CModal>
        )}
      </CContainer>
    </>
  );
};

export default BusinessFeedback;
