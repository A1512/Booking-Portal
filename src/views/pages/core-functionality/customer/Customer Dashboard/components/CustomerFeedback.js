import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import axios from "axios";
import CIcon from "@coreui/icons-react";
import { Tooltip } from "react-tooltip";
import { cilEnvelopeClosed } from "@coreui/icons";
import { Rating } from "react-simple-star-rating";
import {
  CContainer,
  CFormInput,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";

// this component render feedback list of user.
const CustomerFeedback = () => {
  //we use customerID for further use.
  const customerID = useSelector((state) => state.customerID.value);
  const navigate = useNavigate();
  useEffect(() => {
    getCustomerFeedbackList();
  }, []);

  //this variable store feedback list, we get from database.
  const [feedbackList, setFeedbackList] = useState([]);

  //this state variable stores filter data searched by user.
  const [filterFeedbackList, setFilterFeedbackList] = useState([]);

  //this variable stored user entered value in input field.
  const [search, setSearch] = useState("");

  //this is datatable styling object. passed in datatable.
  const tableHeaderStyle = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
        backgroundColor: "gray",
      },
    },
  };

  //this function called in useEffect Hook
  async function getCustomerFeedbackList() {
    try {
      const customerToken = localStorage.getItem("jwt-token-customer");
      const url = `${process.env.REACT_APP_API_URL}getFeedbackListForCustomer`;
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

  //this state variable stores customerFeedback & businessResponse(from backend data) display to Customer in Modal
  //so that customer can see business response & customer review when open the modal
  const [
    storedBusinessResAndCustomerFeedback,
    setStoredBusinessResAndCustomerFeedback,
  ] = useState({
    customerFeedback: "",
    businessResponse: "",
  });

  //this state variable stores boolean value to open & close feedback modal.
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  //this hook works to filter result of user search services.
  useEffect(() => {
    const result = feedbackList.filter((data) => {
      return (
        data.business_name?.toLowerCase().match(search.toLowerCase()) ||
        data.service_name?.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilterFeedbackList(result);
  }, [search]);

  //this function called on onClick event in Datatable, display customer feedbackn & business Response.
  function showFeedbackToCustomer(cusFeedback, busResponse) {
    setStoredBusinessResAndCustomerFeedback((prevValues) => ({
      ...prevValues,
      customerFeedback: cusFeedback,
      businessResponse: busResponse,
    }));
    setShowFeedbackModal(true);
  }

  //this column list is a name of column also it stores data from database in datatable
  const columns = [
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
              showFeedbackToCustomer(row.feedback, row.business_response);
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

  return (
    <>
      <CContainer fluid>
        <DataTable
          title="Feedback List"
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
                  placeholder="search by service name or business name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </>
          }
        />

        {/* this condition will open & close the modal. */}
        {showFeedbackModal && (
          <CModal
            visible={showFeedbackModal}
            onClose={() => setShowFeedbackModal(false)}
          >
            <CModalHeader onClose={() => setShowFeedbackModal(false)}>
              <CModalTitle>Your Feedback</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CContainer>
                <div>
                  <span className="col-1 float-start">me</span>
                  <span className="col-8  float-start">
                    <CFormTextarea
                      rows={2}
                      cols={10}
                      readOnly
                      defaultValue={
                        storedBusinessResAndCustomerFeedback.customerFeedback
                      }
                    />
                  </span>
                </div>
                <br />
                <br />
                <br />
                <div>
                  <span className="col-7 float-end">
                    <CFormTextarea
                      rows={1}
                      cols={10}
                      placeholder="response from business"
                      readOnly
                      defaultValue={
                        storedBusinessResAndCustomerFeedback.businessResponse
                      }
                      // style={{ fontStyle: "italic" }}
                    />
                  </span>
                </div>
              </CContainer>
            </CModalBody>
          </CModal>
        )}
      </CContainer>
    </>
  );
};

export default CustomerFeedback;
