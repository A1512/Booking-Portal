import axios from "axios";
import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Rating } from "react-simple-star-rating";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getBusinessServiceToShowCustomer } from "src/redux-features/reducers/BusinessServicesForCustomer";
import { CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCash, cilFilter, cilStar, cilTag } from "@coreui/icons";

const ShowBusinessServiceFilter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [collapseSidebar, setCollapseSidebar] = useState(false);
  const [priceList, setPriceList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [discountList, setDiscountList] = useState([]);
  useEffect(() => {
    // Remove the localStorage item when the page refreshes.
    window.addEventListener("beforeunload", () => {
      localStorage.removeItem("storePriceFilter");
      localStorage.removeItem("storeReviewFilter");
      localStorage.removeItem("storeDiscountFilter");
    });
    // getBusinessServiceByCustomerFilter("", 0);
    removeFilter();
    const handleResize = () => {
      if (window.innerWidth > 576 && window.innerWidth < 767) {
        setCollapseSidebar(true);
      }
    };

    window.addEventListener("resize", handleResize);
    getFilterDataForCustomerToFilterService();
    return () => {
      // Remove the event listener when the component unmounts.
      window.removeEventListener("beforeunload", () => {
        localStorage.removeItem("storePriceFilter");
        localStorage.removeItem("storeReviewFilter");
        localStorage.removeItem("storeDiscountFilter");
      });
    };
  }, []);

  const [openSubmenuItem, setOpenSubmenuItem] = useState(
    "cash" | "review" | "discount" | undefined
  );
  const handleOpenSubMenu = (key) => {
    if (openSubmenuItem === key) {
      setOpenSubmenuItem(undefined);
    } else {
      setOpenSubmenuItem(key);
    }
  };
  function removeFilter() {
    let isCheckPriceFilter = localStorage.getItem("storePriceFilter");
    let isCheckReviewFilter = localStorage.getItem("storeReviewFilter");
    let isCheckDiscountFilter = localStorage.getItem("storeDiscountFilter");
    if (isCheckPriceFilter || isCheckReviewFilter || isCheckDiscountFilter) {
      localStorage.removeItem("storePriceFilter");
      localStorage.removeItem("storeReviewFilter");
      localStorage.removeItem("storeDiscountFilter");
      getBusinessServiceByCustomerFilter("", 0);
    }
  }
  async function getBusinessServiceByCustomerFilter(filter, flag) {
    if (flag === 1) {
      localStorage.setItem("storePriceFilter", filter);
    } else if (flag === 2) {
      localStorage.setItem("storeReviewFilter", filter);
    } else if (flag === 3) {
      localStorage.setItem("storeDiscountFilter", filter);
    }
    try {
      const getSelectedPriceFilterValue =
        localStorage.getItem("storePriceFilter");
      const getSelectedReviewFilterValue =
        localStorage.getItem("storeReviewFilter");
      const getSelectedDiscountFilterValue = localStorage.getItem(
        "storeDiscountFilter"
      );

      const customerToken = localStorage.getItem("jwt-token-customer");
      const url = `${process.env.REACT_APP_API_URL}getBusinessServicesByCustomerFilter`;
      const businessID = localStorage.getItem("bIdToGetFilterBusinessService");
      const response = await axios.post(
        url,
        {
          priceFilter: getSelectedPriceFilterValue,
          reviewFilter: getSelectedReviewFilterValue,
          discountFilter: getSelectedDiscountFilterValue,
          businessID: businessID,
        },
        {
          headers: {
            "jwt-token-customer": customerToken,
          },
        }
      );
      if (response.status === 200) {
        dispatch(getBusinessServiceToShowCustomer(response.data.recordset));
      } else {
        alert(response.data.message);
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

  async function getFilterDataForCustomerToFilterService() {
    try {
      const customerToken = localStorage.getItem("jwt-token-customer");
      const url = `${process.env.REACT_APP_API_URL}getFilterDataForCustomerToFilterService`;
      const response = await axios.get(url, {
        headers: {
          "jwt-token-customer": customerToken,
        },
      });
      if (response.status === 200) {
        console.log("static data", response);
        setPriceList(response.data.recordsets[0]);
        setReviewList(response.data.recordsets[1]);
        setDiscountList(response.data.recordsets[2]);
      } else {
        console.log(response.data.message);
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

  return (
    <div>
      <CButton
        className="col-12 mx-auto bg-info"
        width="auto"
        onClick={removeFilter}
      >
        <CIcon icon={cilFilter} size="sm" /> Remove Filter
      </CButton>
      <br />
      <Sidebar width="auto" collapsed={collapseSidebar}>
        <Menu
          renderExpandIcon={({ open }) => <span>{open ? "-" : "+"}</span>}
          transitionDuration={1000}
        >
          <SubMenu
            onClick={() => handleOpenSubMenu("cash")}
            defaultOpen
            open={openSubmenuItem === "cash"}
            label="Price"
            icon={<CIcon icon={cilCash} title="filter by price" />}
          >
            {priceList.map((value, index) => (
              <div key={index}>
                <MenuItem
                  className="visitedLink"
                  onClick={() =>
                    getBusinessServiceByCustomerFilter(`${value.price}`, 1)
                  }
                >
                  {value.price}
                </MenuItem>
              </div>
            ))}
          </SubMenu>
          <SubMenu
            onClick={() => handleOpenSubMenu("review")}
            open={openSubmenuItem === "review"}
            label="Customer Review"
            icon={<CIcon icon={cilStar} title="filter by customer review" />}
          >
            {reviewList.map((value, index) => (
              <div key={index}>
                <MenuItem
                  className="visitedLink"
                  onClick={() =>
                    getBusinessServiceByCustomerFilter(
                      `${value.review}-review`,
                      2
                    )
                  }
                >
                  <Rating size={20} readonly initialValue={value.review} />
                </MenuItem>
              </div>
            ))}
          </SubMenu>
          <SubMenu
            label="Discount"
            icon={<CIcon icon={cilTag} title="filter by discount" />}
            onClick={() => handleOpenSubMenu("discount")}
            open={openSubmenuItem === "discount"}
          >
            {discountList.map((value, index) => (
              <div key={index}>
                <MenuItem
                  onClick={() =>
                    getBusinessServiceByCustomerFilter(
                      `${value.discount}-discount`,
                      3
                    )
                  }
                >
                  {value.discount}% Off or more
                </MenuItem>
              </div>
            ))}
          </SubMenu>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default ShowBusinessServiceFilter;
