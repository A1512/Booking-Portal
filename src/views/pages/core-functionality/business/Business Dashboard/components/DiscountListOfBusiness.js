import DataTable from "react-data-table-component";
import React, { useEffect, useState } from "react";
import { CContainer, CFormInput } from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//this component display customer payment status.
const DiscountListOfBusiness = () => {
  //this hoook will bring customer payment list for business.
  useEffect(() => {
    getBusinessDiscountList();
  }, []);

  //this useSelector hook stores businessID for further use.
  const businessID = useSelector((state) => state.businessID.value);

  //this state variable stores customer payment list from server.
  const [discountList, setDiscountList] = useState([]);

  //this state variable stores filtered data, which is searched by user.
  const [filterDiscountData, setFilterDiscountData] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  //this hook works to filter result of user search services.
  useEffect(() => {
    const result = discountList.filter((data) => {
      return (
        data.start_date.toString()?.match(search) ||
        data.end_date.toString()?.match(search) ||
        data.discount_percentage.toString()?.match(search) ||
        data.service_name?.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilterDiscountData(result);
  }, [search]);

  //this function called in useEffect hook.
  async function getBusinessDiscountList() {
    try {
      const businessToken = localStorage.getItem("jwt-token-business");
      const url = `${process.env.REACT_APP_API_URL}getDiscountListForBusiness`;
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
        console.log("response of discount", response.data.recordset);
        setDiscountList(response.data.recordset);
        setFilterDiscountData(response.data.recordset);
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

  // this column define column name in datatable.
  const columns = [
    {
      name: "Service Name",
      selector: (row) => row.service_name,
      width: "col col-lg-1",
    },
    {
      name: "Discount(%)",
      selector: (row) => row.discount_percentage,
      sortable: true,
      width: "col col-lg-1",
    },
    {
      name: "Start Date",
      selector: (row) => {
        const splittingDate = row.start_date.split("T")[0];
        const formatDate = splittingDate.split("-");
        return formatDate[2] + "-" + formatDate[1] + "-" + formatDate[0];
      },
      width: "col col-lg-1",
    },
    {
      name: "End Date",
      selector: (row) => {
        const splittingDate = row.end_date.split("T")[0];
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
          title="Discount History"
          fixedHeader
          customStyles={tableHeaderStyle}
          columns={columns}
          data={filterDiscountData}
          pagination
          highlightOnHover
          subHeader
          subHeaderComponent={
            <>
              <div className="col-md-6 col-sm-12">
                <CFormInput
                  type="text"
                  placeholder="search by service name or discount & start date"
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

export default DiscountListOfBusiness;
