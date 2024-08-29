import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CButton,
  CFormInput,
  CToast,
  CToastHeader,
  CToastBody,
} from "@coreui/react";
import DataTable from "react-data-table-component";
import CIcon from "@coreui/icons-react";
import axios from "axios";
import { cilBan, cilCheckCircle } from "@coreui/icons";
import PropTypes from "prop-types";
// this component show all business list to admin.
const BusinessData = () => {
  //this state variable store business list.
  const [businessData, setBusinessData] = useState([]);

  //we use this state variable for filter business by business name, location, email.
  const [filterBusinessData, setFilterBusinessData] = useState([]);

  //this is state variable to store user entered value in search input.
  const [search, setSearch] = useState("");

  //when user select any rows then that rows stored in this varible.
  const [selectedRows, setSelectedRows] = useState([]);

  //this variable stores api response based on this we can display toster message to admin.
  const [showToast, setShowToast] = useState({
    isShow: false,
    response: null,
  });

  //this function brings all the businesses from database.
  async function getBusinessData() {
    try {
      const url = `${process.env.REACT_APP_API_URL}businessData`;
      const response = await axios.get(url);
      // console.log('form values', inputValue);
      if (response.status === 200) {
        setBusinessData(response.data.recordset);
        setFilterBusinessData(response.data.recordset);
      } else {
        console.log(response.statusText);
      }
    } catch (err) {
      console.log("err", err);
    }
  }

  useEffect(() => {
    getBusinessData();
  }, []);

  useEffect(() => {
    const result = businessData.filter((data) => {
      return (
        data.Business_Name.toLowerCase().match(search.toLowerCase()) ||
        data.location?.toLowerCase().match(search.toLowerCase()) ||
        data.email?.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilterBusinessData(result);
  }, [search]); //search variable passed as params to this hook whenever this variable value change then this hook is called. here we filter user entered text.

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

  //this function is for display message in toast, we got from server & toast we'll disappear after 2 second.
  const showToastAndRefreshData = async (response, flag) => {
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
          response: "Business Service Not Disabled!",
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
          response: "Business Service Not Enabled!",
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
      //this block execute every time weather any operation is successfull or not & bring updated business list.
      getBusinessData();
    }
  };

  //this function takes confirmation from admin to enable or disable business service.
  const disableOrEnableBusinessService = async (emailID, flag) => {
    var confirmResult;
    if (flag === 1) {
      confirmResult = window.confirm(
        `Are you sure want to disable business? with emailId ${emailID}`
      );
    } else {
      confirmResult = window.confirm(
        `Are you sure want to enable business? with emailId ${emailID}`
      );
    }
    if (confirmResult) {
      let url;
      let response;
      try {
        if (flag === 1) {
          url = `${process.env.REACT_APP_API_URL}disableOrEnableServices`;
          response = await axios.post(url, {
            data: {
              email: emailID,
              flag: 2,
              disable: "true",
            },
          });
        } else if (flag === 2) {
          url = `${process.env.REACT_APP_API_URL}disableOrEnableServices`;
          response = await axios.post(url, {
            data: {
              email: emailID,
              flag: 2,
              disable: "false",
            },
          });
        }
        showToastAndRefreshData(response, flag);
      } catch (err) {
        console.log("err occured", err);
      }
    }
  };

  // this is table columns name we define it with business information.
  const columns = [
    {
      name: "Name",
      selector: (row) => row.Business_Name,
      sortable: true,
      width: "col col-lg-1",
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
      width: "col col-lg-1",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      width: "col col-lg-1",
    },
    {
      name: "Phone Number",
      selector: (row) => row.phone_no,
      width: "col col-lg-1",
    },
    {
      name: "Business Category",
      selector: (row) => row.Business_Category,
      width: "col col-lg-1",
    },
    {
      name: "Hour",
      selector: (row) => row.hour,
      width: "col col-lg-1",
    },
    {
      name: "Week Day",
      selector: (row) => row.week_day,
      width: "col col-lg-1",
    },
    {
      name: "Created At",
      selector: (row) => row.created_at,
      width: "col col-lg-1",
    },
    {
      name: "Updated At",
      selector: (row) => row.updated_at,
      width: "col col-lg-1",
    },
    {
      name: "Created By",
      selector: (row) => row.Business_Owner_Name,
      width: "col col-lg-1",
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
            onClick={() => disableOrEnableBusinessService(row.email, 1)}
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
            icon={cilCheckCircle}
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
            onClick={() => disableOrEnableBusinessService(row.email, 2)}
          ></CIcon>
        </div>
      ),
    },
  ];

  //component that renders two button which is for multiple records disable & enable. it takes parameter of selected "rows"
  const MultipleRecordsDisableOrEnable = ({ rows }) => {
    // console.log('selected rows', rows);
    let emailList = rows.map((element) => element.email);
    let response;
    let confirmResult;
    // console.log('emailList', emailList);
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
            roleId: 2,
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
        getBusinessData();
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
            roleId: 2,
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
        getBusinessData();
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
      {/* <h3>Customer Data</h3> */}
      <CCard>
        <CCardBody>
          <DataTable
            title="Business List"
            fixedHeader
            // fixedHeaderScrollHeight="450px"
            customStyles={tableHeaderStyle}
            columns={columns}
            data={filterBusinessData}
            pagination
            selectableRows
            onSelectedRowsChange={(e) => {
              // console.log('event', e);
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
            // subHeaderAlign="center"
            actions={<CButton>Export</CButton>}
          />
        </CCardBody>
      </CCard>
    </>
  );
};

export default BusinessData;

//youtube chanel: https://www.youtube.com/watch?v=1dDK_N909Xo&ab_channel=DcodeShow
