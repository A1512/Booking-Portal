import DataTable from "react-data-table-component";
import React, { useEffect, useState } from "react";
import { CContainer, CFormInput } from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import CIcon from "@coreui/icons-react";
import { cilThumbUp } from "@coreui/icons";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";

//this component display customer payment status.
const BusinessPayment = () => {
  //this hoook will bring customer payment list for business.
  useEffect(() => {
    getBusinessPayment();
  }, []);

  //this useSelector hook stores businessID for further use.
  const businessID = useSelector((state) => state.businessID.value);

  //this state variable stores customer payment list from server.
  const [paymentList, setPaymentList] = useState([]);

  //this state variable stores filtered data, which is searched by user.
  const [filterPaymentData, setFilterPaymentData] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  //this hook works to filter result of user search services.
  useEffect(() => {
    const result = paymentList.filter((data) => {
      return (
        data.service_name?.toLowerCase().match(search.toLowerCase()) ||
        data.service_price?.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilterPaymentData(result);
  }, [search]);

  //this function called in useEffect hook.
  async function getBusinessPayment() {
    try {
      const businessToken = localStorage.getItem("jwt-token-business");
      const url = `${process.env.REACT_APP_API_URL}getPaymentListForBusiness`;
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
        setPaymentList(response.data.recordset);
        setFilterPaymentData(response.data.recordset);
      } else if (response.status === 401) {
        window.alert(response.data.message);
        navigate("/login");
      } else {
        console.log(response.statusText);
      }
    } catch (err) {
      console.log("err", err);
    }
  }

  //this object contain css of datatble.
  const tableHeaderStyle = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
        backgroundColor: "gray",
      },
    },
  };

  //this funtion will change the payment status of cash payment to "Done", if collected by business.
  async function changeCustomerPaymentStatusDone(paymentID) {
    const confirmation = window.confirm("Cash Collected From Customer?");
    if (confirmation) {
      try {
        const businessToken = localStorage.getItem("jwt-token-business");
        const url = `${process.env.REACT_APP_API_URL}paymentStatusDoneIfCashCollectedByBusiness`;
        const response = await axios.post(
          url,
          {
            paymentID: paymentID,
          },
          {
            headers: {
              "jwt-token-business": businessToken,
            },
          }
        );
        if (response.status === 200) {
          alert(response.data.message);
          getBusinessPayment();
        } else {
          console.log(response.statusText);
        }
      } catch (err) {
        console.log("err", err);
        if (err.response.status === 401) {
          // window.alert(e.response.statusText);
          navigate("/login");
        }
      }
    }
  }

  // this column define column name in datatable.
  const columns = [
    {
      name: "Customer Name",
      selector: (row) => row.customer_name,
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
          {row.payment_status === "Done" && (
            <p className="text-success pt-2">{row.payment_status}</p>
          )}
          {row.payment_status === "Cash" && (
            <>
              <CIcon
                icon={cilThumbUp}
                data-tooltip-id="my-tooltip"
                data-tooltip-content="press, if cash collected"
                data-tooltip-place="right"
                className="text-info"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => changeCustomerPaymentStatusDone(row.id)}
              />
              <Tooltip id="my-tooltip" />
            </>
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
  return (
    <>
      <CContainer fluid>
        <DataTable
          title="Payments"
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
                  placeholder="search by service name or price"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </>
          }
        />
      </CContainer>
    </>
  );
};

export default BusinessPayment;
