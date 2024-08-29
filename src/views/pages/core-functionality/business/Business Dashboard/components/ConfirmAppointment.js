import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import axios from "axios";
import { CButton, CFormInput } from "@coreui/react";
import { useNavigate } from "react-router-dom";

//this component show  slot list which is come to business for accept or decline.
const ConfirmAppointment = () => {
  //this useSelector hook stores businessId for further use.
  const registeredBusinessID = useSelector((state) => state.businessID);
  const navigate = useNavigate();

  //this useEffect hook get list of booked slot for business for confirmation.
  useEffect(() => {
    getSlotListForConfirmation();
  }, []);

  //this state variable stores slot list for business.
  const [confirmSlotBookList, setConfirmSlotBookList] = useState([]);
  //this state variable stores filtered data which is searched by user.
  const [confirmSlotBookListFilter, setConfirmSlotBookListFilter] = useState(
    []
  );

  //this state variable stored user entered value in search bar.
  const [search, setSearch] = useState("");

  //this function called in useEffect Hook.
  async function getSlotListForConfirmation() {
    try {
      const businessToken = localStorage.getItem("jwt-token-business");
      const url = `${process.env.REACT_APP_API_URL}getSlotListForBusinessToConfirmSlot`;
      const response = await axios.post(url, registeredBusinessID, {
        headers: {
          "jwt-token-business": businessToken,
        },
      });
      if (response.status === 200) {
        console.log("response", response.data.recordset);
        setConfirmSlotBookList(response.data.recordset);
        setConfirmSlotBookListFilter(response.data.recordset);
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
    const result = confirmSlotBookList.filter((data) => {
      return (
        data.date?.toLowerCase().match(search.toLowerCase()) ||
        data.service_name?.toLowerCase().match(search.toLowerCase()) ||
        data.customer_name?.toLowerCase().match(search.toLowerCase())
      );
    });
    setConfirmSlotBookListFilter(result);
  }, [search]);

  //this function handle accept slot by business
  async function handleAcceptSlot(appointmentID) {
    const confirmation = window.confirm("are you sure want to accept");
    if (confirmation) {
      try {
        const businessToken = localStorage.getItem("jwt-token-business");
        const url = `${process.env.REACT_APP_API_URL}acceptOrDeclineSlotByBusiness`;
        const response = await axios.post(
          url,
          {
            appointment_ID: appointmentID,
            flag: 1,
          },
          {
            headers: {
              "jwt-token-business": businessToken,
            },
          }
        );
        if (response.status === 200) {
          console.log("response", response.data.message);
        }
      } catch (e) {
        console.log("error while accept the slot", e);
        if (e.response.status === 401) {
          // window.alert(e.response.statusText);
          navigate("/login");
        }
      }
    }
  }

  //this function handle reject slot by business
  async function handleRejectSlot(appointmentID) {
    const confirmation = window.confirm("are you sure want to reject");
    if (confirmation) {
      try {
        const businessToken = localStorage.getItem("jwt-token-business");
        const url = `${process.env.REACT_APP_API_URL}acceptOrDeclineSlotByBusiness`;
        const response = await axios.post(
          url,
          {
            appointment_ID: appointmentID,
            flag: 2,
          },
          {
            headers: {
              "jwt-token-business": businessToken,
            },
          }
        );
        if (response.status === 200) {
          console.log("response", response.data.message);
        }
      } catch (e) {
        console.log("error while decline the slot", e);
        if (e.response.status === 401) {
          // window.alert(e.response.statusText);
          navigate("/login");
        }
      }
    }
  }

  //this columns define column name in data-table passed in datatable
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
      selector: (row) => row.price,
      sortable: true,
      width: "col col-lg-1",
    },
    {
      name: "Appointment Date",
      sortable: true,
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
      name: "Action",
      cell: (row) => (
        <div>
          <CButton
            id={`accept${row.id}`}
            className={
              row.booking_status === "done" || row.booking_status === "reject"
                ? "btn btn-sm btn-secondary"
                : "btn btn-sm btn-success"
            }
            style={{
              pointerEvents:
                row.booking_status === "done" || row.booking_status === "reject"
                  ? "none"
                  : "auto",
            }}
            onClick={() => handleAcceptSlot(row.id)}
          >
            Accept
          </CButton>
          &nbsp;&nbsp;&nbsp;
          <CButton
            id={`reject${row.id}`}
            className={
              row.booking_status === "done" || row.booking_status === "reject"
                ? "btn btn-sm btn-secondary"
                : "btn btn-sm btn-danger"
            }
            style={{
              pointerEvents:
                row.booking_status === "done" || row.booking_status === "reject"
                  ? "none"
                  : "auto",
            }}
            onClick={() => handleRejectSlot(row.id)}
          >
            Reject
          </CButton>
        </div>
      ),
    },
  ];

  const tableHeaderStyle = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
        backgroundColor: "gray",
      },
    },
  };
  return (
    <>
      <DataTable
        title="Appointments"
        fixedHeader
        customStyles={tableHeaderStyle}
        columns={columns}
        data={confirmSlotBookListFilter}
        pagination
        highlightOnHover
        subHeader
        subHeaderComponent={
          <>
            <div className="col-md-6 col-sm-12">
              <CFormInput
                type="text"
                placeholder="search by service name or customer name or date"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </>
        }
      />
    </>
  );
};

export default ConfirmAppointment;
