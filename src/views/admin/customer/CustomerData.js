import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CButton,
  CCard,
  CCardBody,
  CFormInput,
  CToast,
  CToastHeader,
  CToastBody,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBan, cilCheckCircle } from "@coreui/icons";
import DataTable from "react-data-table-component";
import PropTypes from "prop-types";
const CustomerData = () => {
  //this state variable store customer list.
  const [customerData, setCustomerData] = useState([]);

  //this is state variable to store user entered value in search input.
  const [search, setSearch] = useState("");

  //we use this state variable for filter business by customer name, location, email.
  const [filterCustomerData, setFilterCustomerData] = useState([]);

  //when user select any rows then that rows stored in this varible.
  const [selectedRows, setSelectedRows] = useState([]);

  //this variable stores api response based on this we can display toster message to admin.
  const [showToast, setShowToast] = useState({
    isShow: false,
    response: null,
  });

  //this function brings all the businesses from database.
  async function getCustomerData() {
    try {
      const url = `${process.env.REACT_APP_API_URL}customerData`;
      const response = await axios.get(url);
      // console.log('form values', inputValue);
      if (response.status === 200) {
        setCustomerData(response.data.recordset);
        setFilterCustomerData(response.data.recordset);
        console.log("Customer Data", response.data.recordset);
      } else {
        console.log(response.statusText);
      }
    } catch (err) {
      console.log("err", err);
    }
  }

  useEffect(() => {
    getCustomerData();
  }, []);

  useEffect(() => {
    const result = customerData.filter((data) => {
      return (
        data.name.toLowerCase().includes(search.toLowerCase()) || // Check for name
        data.location?.toLowerCase().includes(search.toLowerCase()) || // Check for location
        data.email?.toLowerCase().includes(search.toLowerCase()) // Check for email
      );
    });

    setFilterCustomerData(result);
  }, [search]); //search variable passed as params to this hook whenever this variable value change then this hook is called. here we filter user entered text.

  //this function is for display message in toast, we got from server & toast we'll disappear after 2 second.
  const showToastAndRefreshData = (response, flag) => {
    try {
      console.log("response from backend", response);
      if (response.status === 200) {
        setShowToast((prevValue) => ({
          ...prevValue,
          isShow: true,
          response: response.data,
        }));

        setTimeout(() => {
          setShowToast((prevValue) => ({
            ...prevValue,
            isShow: false,
          }));
        }, 2000);
      } else {
        console.log("error code", response);
      }
    } catch (err) {
      //if flag 1 then failed to disable business service we display this message to admin for 2 second.
      if (flag === 1) {
        setShowToast((prevValue) => ({
          ...prevValue,
          isShow: true,
          response: "Customer Service Not Disabled!",
        }));

        setTimeout(() => {
          setShowToast((prevValue) => ({
            ...prevValue,
            isShow: false,
          }));
        }, 2000);
      } else {
        setShowToast((prevValue) => ({
          ...prevValue,
          isShow: true,
          response: "Customer Service Not Enabled!",
        }));

        setTimeout(() => {
          setShowToast((prevValue) => ({
            ...prevValue,
            isShow: false,
          }));
        }, 2000);
      }
      console.log("error", err);
    } finally {
      //this block execute every time weather any operation is successfull or not & bring updated customer list.
      getCustomerData();
    }
  };

  //this function takes confirmation from admin to enable or disable business service.
  const disableOrEnableCustomerService = async (emailID, flag) => {
    var confirmResult;
    if (flag === 1) {
      confirmResult = window.confirm(
        `Are you sure want to disable customer? with emailId ${emailID}`
      );
    } else {
      confirmResult = window.confirm(
        `Are you sure want to enable customer? with emailId ${emailID}`
      );
    }
    if (confirmResult) {
      let url;
      let response;
      if (flag === 1) {
        url = `${process.env.REACT_APP_API_URL}disableOrEnableServices`;
        response = await axios.post(url, {
          data: {
            email: emailID,
            flag: 3,
            disable: "true",
          },
        });
      } else if (flag === 2) {
        url = `${process.env.REACT_APP_API_URL}disableOrEnableServices`;
        response = await axios.post(url, {
          data: {
            email: emailID,
            flag: 3,
            disable: "false",
          },
        });
      }
      showToastAndRefreshData(response, flag);
    }
  };

  // this is table columns name we define it with customer information.
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phone_no,
    },
    {
      name: "Created At",
      selector: (row) => row.created_at,
    },
    {
      name: "Updated At",
      selector: (row) => row.updated_at,
    },
    {
      name: "Is Active",
      selector: (row) => String(row.is_active),
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <CIcon
            icon={cilBan}
            size="lg"
            onClick={() => disableOrEnableCustomerService(row.email, 1)}
            style={
              String(row.is_active) === "false" || selectedRows.length > 1
                ? {
                    cursor: "pointer",
                    pointerEvents: "none",
                    color: "gray",
                  }
                : {
                    cursor: "pointer",
                    pointerEvents: "auto",
                    color: "white",
                  }
            }
          ></CIcon>
          &nbsp;&nbsp;&nbsp;
          <CIcon
            size="lg"
            icon={cilCheckCircle}
            onClick={() => disableOrEnableCustomerService(row.email, 2)}
            style={
              String(row.is_active) === "true" || selectedRows.length > 1
                ? {
                    cursor: "pointer",
                    pointerEvents: "none",
                    color: "gray",
                  }
                : {
                    cursor: "pointer",
                    pointerEvents: "auto",
                    color: "white",
                  }
            }
          ></CIcon>
        </div>
      ),
    },
  ];

  //this is datatable style object we passed in datatable.
  const tableHeaderStyle = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
        backgroundColor: "gray",
      },
    },
  };

  //component that renders two button which is for multiple records disable & enable
  const MultipleRecordsDisableOrEnable = ({ rows }) => {
    // console.log('selected rows', rows);
    let emailList = rows.map((element) => element.email);
    let response;
    let confirmResult;
    console.log("emailList", emailList);
    const handleMultipleDisableRecords = async () => {
      try {
        confirmResult = window.confirm(
          `Are you sure want to disable multiple records`
        );
        if (confirmResult) {
          const url = `${process.env.REACT_APP_API_URL}multipleDisableOrEnableRecords`;
          response = await axios.post(url, {
            listOfEmails: emailList,
            disable: "true",
            roleId: 3,
          });
          console.log("respose of multiple select", response);
        }
        if (response.status === 200) {
          setShowToast((prevValue) => ({
            ...prevValue,
            isShow: true,
            response: response.data,
          }));

          setTimeout(() => {
            setShowToast((prevValue) => ({
              ...prevValue,
              isShow: false,
            }));
          }, 2000);
        } else {
          setShowToast((prevValue) => ({
            ...prevValue,
            isShow: true,
            response: response.data,
          }));

          setTimeout(() => {
            setShowToast((prevValue) => ({
              ...prevValue,
              isShow: false,
            }));
          }, 2000);
        }
      } catch (err) {
        console.log("err", err);
      } finally {
        getCustomerData();
      }
    };
    const handleMultipleEnableRecords = async () => {
      try {
        confirmResult = window.confirm(
          `Are you sure want to enable multiple records`
        );
        if (confirmResult) {
          const url = `${process.env.REACT_APP_API_URL}multipleDisableOrEnableRecords`;
          response = await axios.post(url, {
            listOfEmails: emailList,
            disable: "false",
            roleId: 3,
          });
          console.log("respose of multiple select", response);
        }
        if (response.status === 200) {
          setShowToast((prevValue) => ({
            ...prevValue,
            isShow: true,
            response: response.data,
          }));

          setTimeout(() => {
            setShowToast((prevValue) => ({
              ...prevValue,
              isShow: false,
            }));
          }, 2000);
        } else {
          setShowToast((prevValue) => ({
            ...prevValue,
            isShow: true,
            response: response.data,
          }));

          setTimeout(() => {
            setShowToast((prevValue) => ({
              ...prevValue,
              isShow: false,
            }));
          }, 2000);
        }
      } catch (err) {
        console.log("err", err);
      } finally {
        getCustomerData();
      }
    };
    return (
      <span className="row">
        <CButton
          size="sm"
          className="col-md-4"
          color="info"
          onClick={handleMultipleDisableRecords}
        >
          Disable Multiple Records
        </CButton>
        &nbsp;
        <CButton
          size="sm"
          className="col-md-4"
          color="info"
          onClick={handleMultipleEnableRecords}
        >
          Enable Multiple Records
        </CButton>
      </span>
    );
  };
  MultipleRecordsDisableOrEnable.propTypes = {
    rows: PropTypes.array.isRequired,
  };
  return (
    <>
      {/* if this condition true then admin can show toast message. */}
      {showToast.isShow && (
        <CToast animation={true} visible={true}>
          <CToastHeader closeButton>
            <svg
              className="rounded me-2"
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
              focusable="false"
              role="img"
            >
              <rect width="100%" height="100%" fill="#007aff"></rect>
            </svg>
            <div className="fw-bold me-auto">Status Updated</div>
          </CToastHeader>
          <CToastBody>{showToast.response}</CToastBody>
        </CToast>
      )}
      <CCard>
        <CCardBody>
          <DataTable
            title="Customer List"
            fixedHeader
            // fixedHeaderScrollHeight="450px"
            customStyles={tableHeaderStyle}
            columns={columns}
            data={filterCustomerData}
            pagination
            selectableRows
            onSelectedRowsChange={(e) => {
              console.log("event", e);
              setSelectedRows(e.selectedRows);
            }}
            highlightOnHover
            subHeader
            subHeaderComponent={
              <>
                <div className="col-md-6 col-sm-12 text-start">
                  {selectedRows.length > 1 && (
                    <MultipleRecordsDisableOrEnable rows={selectedRows} />
                  )}
                </div>
                <div className="col-md-6 col-sm-12">
                  <CFormInput
                    type="text"
                    placeholder="search by name or location or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </>
            }
            subHeaderAlign="center"
            actions={<CButton>Export</CButton>}
          />
        </CCardBody>
      </CCard>
    </>
  );
};

export default CustomerData;
