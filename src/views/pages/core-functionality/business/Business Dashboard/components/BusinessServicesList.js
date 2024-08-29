import React, { useEffect } from "react";
import {
  cilPlus,
  cilPen,
  cilDelete,
  cilLockLocked,
  cilBell,
  cilDescription,
  cilTag,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CInputGroup,
  CInputGroupText,
  CButton,
  CCol,
  CCard,
  CContainer,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CModalBody,
  CCardBody,
  CFormInput,
  CImage,
  CToast,
  CToastHeader,
  CToastBody,
  CForm,
  CFormTextarea,
  CBadge,
  CAccordion,
  CAccordionHeader,
  CAccordionItem,
  CAccordionBody,
  CListGroup,
  CListGroupItem,
} from "@coreui/react";
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import AddBusinessServices from "../../Business Services Page/AddBusinessServices";
import axios from "axios";
import DataTable from "react-data-table-component";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationCount } from "src/redux-features/reducers/GetNotificationCountForSlotBooked";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import BusinessServiceDiscount from "./BusinessServiceDiscount";

const BusinessServicesList = () => {
  //this state variable stores boolean value to open "add business service modal"
  const [addServicesModal, setAddServicesModal] = useState(false);

  //this state variable stores boolean value to open "edit business sercice modal"
  const [updateServicesModal, setUpdateServicesModal] = useState(false);

  //this state variable stores boolean value to show customer notification.
  const [showNotification, setShowNotification] = useState(false);

  //this state varible used to store customer booked slot list for further use.
  const [storedBookSlotList, setStoredBookSlotList] = useState([]);

  //this react-redux hook will give an action method to store data at globle level.
  const dispatch = useDispatch();

  //this hook is use to navigate user to another page.
  const navigate = useNavigate();

  // react hook form
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
  });

  //this state variable use to store business services list.
  const [businessServices, setBusinessServices] = useState([]);

  //this state variable store business service image in this variable so we can display that image on edit service.
  const [previewImage, setPreviewImage] = useState();

  //this state variable stores filtered data, user searched in search bar.
  const [filterBusinessServiceData, setFilterBusinessServiceData] = useState(
    []
  );

  //this state variable stored selected business services.
  const [selectedRows, setSelectedRows] = useState([]);

  //this state variable stores value entred by user to search business services.
  const [search, setSearch] = useState("");

  //we use useSelector hook to get businessID for further use.
  const registeredBusinessID = useSelector((state) => state.businessID);

  //we use useSelector hook to get slotNotificationCount that business can show how many notification arrived.
  const slotNotificationCount = useSelector(
    (state) => state.slotNotificationCount
  );

  //this formData object used to stored form data because we use file.
  const formData = new FormData();

  //this state variable stores toast status. open/close modal.
  const [showToast, setShowToast] = useState({
    isShow: false,
    response: null,
  });

  //this state variable open modal so business can add discounts on service
  const [displayDiscountModal, setDisplayDiscountModal] = useState(false);

  //this hook called at once to getServiceData.
  useEffect(() => {
    getServicesData();
  }, []);

  //show notifications on badge to confirm or reject their booking
  useEffect(() => {
    getSlotListForConfirmation();
  }, []);
  //this hook works to filter result of user search services.
  useEffect(() => {
    const result = businessServices.filter((data) => {
      return (
        data.name?.toLowerCase().match(search.toLowerCase()) ||
        data.price?.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilterBusinessServiceData(result);
  }, [search]);

  //this function called in useEffect hook.
  async function getServicesData() {
    try {
      const businessToken = localStorage.getItem("jwt-token-business");
      const url = `${process.env.REACT_APP_API_URL}getBusinessServices`;
      const response = await axios.post(
        url,
        { value: registeredBusinessID.value, flag: null },
        {
          headers: {
            "jwt-token-business": businessToken,
          },
        }
      );
      if (response.status === 200) {
        // console.log('response', response.data.recordset);
        setBusinessServices(response.data.recordset);
        setFilterBusinessServiceData(response.data.recordset);
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

  //this function get list of booked slot.
  async function getSlotListForConfirmation() {
    try {
      const businessToken = localStorage.getItem("jwt-token-business");
      const url = `${process.env.REACT_APP_API_URL}getBookedSlotList`;
      const response = await axios.post(url, registeredBusinessID, {
        headers: {
          "jwt-token-business": businessToken,
        },
      });
      if (response.status === 200) {
        console.log("response", response.data.recordset);
        dispatch(getNotificationCount(response.data.recordset.length));
        setStoredBookSlotList(response.data.recordset);
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

  //this function will store existing value in input value from database.
  const updateSelectedRecord = (selectedRow) => {
    console.log("selected row for update", selectedRow);
    reset((formValues) => ({
      ...formValues,
      rowId: selectedRow.id,
      image: selectedRow.imageURL,
      imgName: selectedRow.name,
      price: selectedRow.price,
      shortDesc: selectedRow.short_description,
      longDesc: selectedRow.long_description,
    }));
    setUpdateServicesModal(true);
    setPreviewImage(selectedRow.imageURL);
  };

  //this is toast funtion will execute on server response to display server message.
  const showToastAndRefreshData = (response) => {
    try {
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
        console.log("response =>", response);
      }
    } catch (e) {
      setShowToast((prevValue) => ({
        ...prevValue,
        isShow: true,
        response: "Record is Not Updated!",
      }));

      setTimeout(() => {
        setShowToast((prevValue) => ({
          ...prevValue,
          isShow: false,
        }));
      }, 2000);
      console.log("Err", e);
    } finally {
      getServicesData();
    }
  };

  //this function delete business service by service id & service name.
  const deleteSelectedRecord = async (selectedRow, imgName) => {
    console.log("selected row for delete", selectedRow);
    var confirmResult;
    if (selectedRow) {
      confirmResult = window.confirm(`Are you sure want to delete ${imgName} `);
    }
    if (confirmResult) {
      let url;
      let response;
      try {
        const businessToken = localStorage.getItem("jwt-token-business");
        url = `${process.env.REACT_APP_API_URL}deleteSelectedRowBusDashBusServicePage`;
        response = await axios.post(
          url,
          {
            data: {
              deleteRecordID: selectedRow,
            },
          },
          {
            headers: {
              "jwt-token-business": businessToken,
            },
          }
        );

        showToastAndRefreshData(response);
      } catch (err) {
        console.log("err occured", err);
        if (err.response.status === 401) {
          // window.alert(e.response.statusText);
          navigate("/login");
        }
      }
    }
  };

  //this function open modal so that business can add discounts on services.
  function addOrUpdateDiscountOnThisService(rowID, serviceName, businessID) {
    const dataForDiscountOnService = {
      serviceId: rowID,
      serviceName: serviceName,
      busID: businessID,
    };

    localStorage.setItem(
      "dataForDiscountOnService",
      JSON.stringify(dataForDiscountOnService)
    );
    setDisplayDiscountModal(true);
  }

  //this columns define column name in data-table passed in datatable.
  const columns = [
    {
      name: "Image",
      cell: (row) => {
        if (row.imageURL.includes("mp4")) {
          return (
            <video width={80} height={80} controls>
              <source src={row.imageURL} />
            </video>
          );
        } else {
          return (
            <CImage
              src={row.imageURL}
              thumbnail={true}
              height={80}
              width={80}
              alt="logo"
            />
          );
        }
        // return (
        //   {row.imageURL}
        // );
      },
      width: "col col-lg-1",
    },
    {
      name: "Service Name",
      selector: (row) => row.name,
      sortable: true,
      width: "col col-lg-1",
    },
    {
      name: "Price(₹)",
      selector: (row) => row.price,
      // sortable: true,
      width: "col col-lg-1",
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <>
            <CIcon
              icon={cilPen}
              data-tooltip-id="edit-service"
              data-tooltip-content="edit service"
              data-tooltip-place="right"
              style={{
                cursor: "pointer",
                pointerEvents: selectedRows.length > 1 ? "none" : "auto",
                color: selectedRows.length > 1 ? "gray" : "inherit",
              }}
              onClick={() => updateSelectedRecord(row)}
            ></CIcon>
            <Tooltip id="edit-service" />
          </>
          &nbsp;&nbsp;&nbsp;
          <>
            <CIcon
              icon={cilDelete}
              data-tooltip-id="delete-service"
              data-tooltip-content="delete service"
              data-tooltip-place="right"
              style={{
                cursor: "pointer",
                pointerEvents: selectedRows.length > 1 ? "none" : "auto",
                color: selectedRows.length > 1 ? "gray" : "inherit",
              }}
              onClick={() => deleteSelectedRecord(row.id, row.name)}
            ></CIcon>
            <Tooltip id="delete-service" />
          </>
          &nbsp;&nbsp;&nbsp;
          <>
            <CIcon
              icon={cilTag}
              data-tooltip-id="discount"
              data-tooltip-content="add discount"
              data-tooltip-place="right"
              style={{
                cursor: "pointer",
                pointerEvents: selectedRows.length > 1 ? "none" : "auto",
                color: selectedRows.length > 1 ? "gray" : "inherit",
              }}
              onClick={() =>
                addOrUpdateDiscountOnThisService(
                  row.id,
                  row.name,
                  row.business_id
                )
              }
            ></CIcon>
            <Tooltip id="discount" />
          </>
        </div>
      ),
    },
  ];

  //this object define style of data-table. passed in data-table.
  const tableHeaderStyle = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
        backgroundColor: "gray",
      },
    },
  };

  //this function handle record which is going to updated.
  const handleUpdatedRecordSave = async (data, event) => {
    debugger;
    event.preventDefault();
    console.log("updated record value", data);
    if (isValid) {
      try {
        // formData.append('imgFile', inputValue[1].imgFile);
        formData.append("imgFile", data.imgFile[0]);
        formData.append("alreadyStoredImage", data.image);
        formData.append("imgName", data.imgName);
        formData.append("imgPrice", data.price);
        formData.append("rowID", data.rowId);
        formData.append("shortDesc", data.shortDesc);
        formData.append("longDesc", data.longDesc);
        formData.append("businessID", registeredBusinessID.value);
        console.log("hello ==>", formData.get("imgFile"));
        const businessToken = localStorage.getItem("jwt-token-business");
        const url = `${process.env.REACT_APP_API_URL}updateRecordOnSelectedRowBusDashBusServicePage`;
        const response = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "jwt-token-business": businessToken,
          },
        });
        if (response.status === 200) {
          console.log("response message", response.data);
          setUpdateServicesModal(false);
          showToastAndRefreshData(response);
        } else if (response.status === 401) {
          window.alert(response.data.message);
          navigate("/login");
        } else if (response.status === 201) {
          window.alert("service name already exist");
        } else {
          console.log("error code", response.data);
        }
      } catch (err) {
        console.log("error", err);
        if (err.response.status === 401) {
          // window.alert(e.response.statusText);
          navigate("/login");
        }
      }
    }
  };

  //accept slot in notification modal
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
  //reject slot in notification modal
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

  //component that renders button which is for delete multiple records
  const DeleteMultipleRecords = ({ rows }) => {
    console.log("selected rows", rows);
    let idList = rows.map((element) => element.id);
    let response;
    let confirmResult;
    // console.log('idList', idList);
    const handleMultipleDeleteRecords = async () => {
      try {
        confirmResult = window.confirm(
          `Are you sure want to delete multiple records`
        );
        if (confirmResult) {
          const businessToken = localStorage.getItem("jwt-token-business");
          const url = `${process.env.REACT_APP_API_URL}deleteMultipleSelectedRowBusDashBusServicePage`;
          response = await axios.post(
            url,
            {
              listOfID: idList,
            },
            {
              headers: {
                "jwt-token-business": businessToken,
              },
            }
          );
          // console.log('respose of multiple select', response);
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
        }
      } catch (err) {
        console.log("err", err);
        if (err.response.status === 401) {
          // window.alert(e.response.statusText);
          navigate("/login");
        }
      } finally {
        getServicesData();
      }
    };
    return (
      <div>
        <CButton
          size="sm"
          className="col-md-4"
          color="info"
          onClick={handleMultipleDeleteRecords}
        >
          Remove Multiple Records
        </CButton>
      </div>
    );
  };
  DeleteMultipleRecords.propTypes = {
    rows: PropTypes.array.isRequired,
  };

  // this function update the status of notification count on notification modal close.
  const handleNotificationCountOnModalClose = async () => {
    try {
      const businessToken = localStorage.getItem("jwt-token-business");
      const url = `${process.env.REACT_APP_API_URL}updateNotificationStatus`;
      const response = await axios.post(url, registeredBusinessID, {
        headers: {
          "jwt-token-business": businessToken,
        },
      });
      if (response.status === 200) {
        console.log("response for notification", response);
        dispatch(getNotificationCount(0));
        setStoredBookSlotList(response.data.recordset);
      } else {
        console.log(response.statusText);
      }
    } catch (e) {
      console.log("error while update notification count", e);
      if (e.response.status === 401) {
        // window.alert(e.response.statusText);
        navigate("/login");
      }
    } finally {
      setShowNotification(false);
    }
  };
  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CIcon
            className="float-start bg-info p-2"
            style={{ borderRadius: "100%" }}
            icon={cilBell}
            size="3xl"
            onClick={() => setShowNotification(true)}
          />
          <CBadge color="danger">{slotNotificationCount.value}</CBadge>
        </CCol>
        <CCol>
          <CIcon
            className="float-end bg-info p-2"
            style={{ borderRadius: "100%" }}
            icon={cilPlus}
            size="3xl"
            onClick={() => setAddServicesModal(true)}
          />
        </CCol>
      </CRow>

      {/*this condition will open business service modal for update. */}
      {updateServicesModal && (
        <CModal
          alignment="center"
          visible={updateServicesModal}
          onClose={() => {
            setUpdateServicesModal(false);
          }}
          scrollable={true}
          size="xl"
          unmountOnClose={true}
          aria-labelledby="Business Dashboard-(add-business-services module)"
        >
          <CModalHeader
            onClose={() => {
              setUpdateServicesModal(false);
            }}
          >
            <CModalTitle id="BD-AddServices">
              Change Image or Name or Price
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm
              onSubmit={handleSubmit(handleUpdatedRecordSave)}
              encType="multipart/form-data"
            >
              <CRow>
                <CCol className="col">
                  <CInputGroup className="mb-4">
                    <CFormInput
                      placeholder="Choose an Image"
                      type="file"
                      accept="image/*,video/*"
                      name="imgFile"
                      {...register("imgFile", {
                        validate: {
                          fileSize: (value) =>
                            value[0]?.size > 5000000 ? false : true, // when file size is >5mb it returns false & show the error message(it indicates that validations false)
                        },
                      })}
                    />
                  </CInputGroup>

                  {/* error for file */}
                  {errors.imgFile && errors.imgFile?.type === "fileSize" && (
                    <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                      Image size should be between 1 MB to 5 MB
                    </div>
                  )}
                  {previewImage.includes("mp4") ? (
                    <video width={200} height={100} controls>
                      <source src={previewImage} />
                    </video>
                  ) : (
                    <CImage
                      src={previewImage}
                      alt="preview image"
                      className="p-2"
                      height={100}
                      width={100}
                    />
                  )}
                </CCol>
                <CCol className="col">
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Service Name"
                      {...register("imgName", {
                        required: true,
                      })}
                    />
                  </CInputGroup>

                  {/* error for name */}
                  {errors?.imgName && errors?.imgName?.type === "required" && (
                    <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                      Service name is required
                    </div>
                  )}
                </CCol>
                <CCol className="col">
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Service Price(₹)"
                      {...register("price", {
                        required: true,
                        pattern: /^[0-9\b]+$/,
                      })}
                    />
                  </CInputGroup>

                  {/* error for name */}
                  {errors.price && errors.price?.type === "required" && (
                    <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                      Price is required
                    </div>
                  )}
                  {errors.price && errors.price?.type === "pattern" && (
                    <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                      Only numbers are allowed
                    </div>
                  )}
                </CCol>
              </CRow>
              <CRow>
                <CCol className="col">
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilDescription} />
                    </CInputGroupText>
                    <CFormTextarea
                      type="text"
                      placeholder="Short Description"
                      {...register("shortDesc", {
                        required: true,
                        maxLength: 50,
                      })}
                      rows={2}
                      cols={20}
                    />
                  </CInputGroup>
                  {errors?.shortDesc &&
                    errors.shortDesc?.type === "required" && (
                      <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                        Short description is required
                      </div>
                    )}
                  {errors?.shortDesc &&
                    errors.shortDesc?.type === "maxLength" && (
                      <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                        max length is 50
                      </div>
                    )}
                </CCol>
                <CCol className="col">
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilDescription} />
                    </CInputGroupText>
                    <CFormTextarea
                      type="text"
                      placeholder="Long Description"
                      {...register("longDesc", {
                        required: true,
                        maxLength: 100,
                      })}
                      rows={2}
                      cols={20}
                    />
                  </CInputGroup>
                  {errors?.longDesc && errors.longDesc?.type === "required" && (
                    <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                      Long description is required
                    </div>
                  )}
                  {errors?.longDesc &&
                    errors.longDesc?.type === "maxLength" && (
                      <div style={{ fontSize: "14px", color: "#e65a5a" }}>
                        max length is 150
                      </div>
                    )}
                </CCol>
              </CRow>
              <CModalFooter>
                <CRow>
                  <CCol className="col text-center">
                    <CButton
                      color="info"
                      id="saveButton"
                      type="submit"
                      className="px-4"
                    >
                      Save
                    </CButton>
                  </CCol>
                  <CCol className="col text-center">
                    <CButton
                      color="secondary"
                      id={`cancelButton`}
                      type="button"
                      onClick={() => setUpdateServicesModal(false)}
                      className="px-4"
                    >
                      cancel
                    </CButton>
                  </CCol>
                </CRow>
              </CModalFooter>
            </CForm>
          </CModalBody>
        </CModal>
      )}

      {/* this condition will show toast to display message */}
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
      <br />
      {/* this condition will open modal to add business service */}
      {addServicesModal && (
        <CModal
          alignment="center"
          visible={addServicesModal}
          onClose={() => {
            setAddServicesModal(false);
          }}
          fullscreen="xl"
          scrollable={false}
          size="xl"
          unmountOnClose={true}
          aria-labelledby="Business Dashboard-(add-business-services module)"
        >
          <CModalHeader onClose={() => setAddServicesModal(false)}>
            <CModalTitle id="BD-AddServices">
              Add More Services into Business
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <AddBusinessServices
              viewHeight={0}
              closeModal={() => {
                setAddServicesModal(false);
                getServicesData();
              }}
            />
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => setAddServicesModal(false)}
            >
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      )}

      {/* this condition will open modal for accept or decline modal from notification bar */}
      {showNotification && (
        <CModal
          visible={showNotification}
          onClose={() => handleNotificationCountOnModalClose()}
          aria-labelledby="LiveDemoExampleLabel"
        >
          <CModalHeader onClose={() => handleNotificationCountOnModalClose()}>
            <CModalTitle id="LiveDemoExampleLabel">Confirm Slots</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CCard>
              <CCardBody>
                {storedBookSlotList ? (
                  <CAccordion>
                    {storedBookSlotList.map((value, index) => {
                      let splittedDate = value.date.split("T")[0];
                      let formatedDate = splittedDate.split("-");
                      let finalDate =
                        formatedDate[2] +
                        "-" +
                        formatedDate[1] +
                        "-" +
                        formatedDate[0];

                      return (
                        <>
                          <CAccordionItem key={value.id} itemKey={index}>
                            <CAccordionHeader>
                              {value.customer_name}
                            </CAccordionHeader>
                            <CAccordionBody>
                              <CListGroup>
                                <CListGroupItem className="d-flex justify-content-between align-items-center">
                                  Service Name
                                  <CBadge
                                    color="primary"
                                    style={{ borderRadius: "none" }}
                                  >
                                    {value.service_name}
                                  </CBadge>
                                </CListGroupItem>
                                <CListGroupItem className="d-flex justify-content-between align-items-center">
                                  Slot Time
                                  <CBadge
                                    color="primary"
                                    style={{ borderRadius: "none" }}
                                  >
                                    {value.slot_time}
                                  </CBadge>
                                </CListGroupItem>
                                <CListGroupItem className="d-flex justify-content-between align-items-center">
                                  Appointment Date
                                  <CBadge
                                    color="primary"
                                    style={{ borderRadius: "none" }}
                                  >
                                    {finalDate}
                                  </CBadge>
                                </CListGroupItem>
                                <CListGroupItem className="d-flex justify-content-evenly align-items-center">
                                  <CButton
                                    style={
                                      value.booking_status === "done" ||
                                      value.booking_status === "reject"
                                        ? { pointerEvents: "none" }
                                        : { pointerEvents: "auto" }
                                    }
                                    className={
                                      value.booking_status === "done" ||
                                      value.booking_status === "reject"
                                        ? "btn btn-sm btn-secondary"
                                        : "btn btn-sm btn-success"
                                    }
                                    onClick={() =>
                                      handleAcceptSlot(value.appointment_id)
                                    }
                                  >
                                    Accept
                                  </CButton>
                                  <CButton
                                    style={
                                      value.booking_status === "done" ||
                                      value.booking_status === "reject"
                                        ? { pointerEvents: "none" }
                                        : { pointerEvents: "auto" }
                                    }
                                    className={
                                      value.booking_status === "done" ||
                                      value.booking_status === "reject"
                                        ? "btn btn-sm btn-secondary"
                                        : "btn btn-sm btn-danger"
                                    }
                                    onClick={() =>
                                      handleRejectSlot(value.appointment_id)
                                    }
                                  >
                                    Reject
                                  </CButton>
                                </CListGroupItem>
                              </CListGroup>
                            </CAccordionBody>
                          </CAccordionItem>
                        </>
                      );
                    })}
                  </CAccordion>
                ) : (
                  <p>No Slots Found</p>
                )}
              </CCardBody>
            </CCard>
          </CModalBody>
        </CModal>
      )}

      {displayDiscountModal && (
        <CModal
          alignment="center"
          visible={displayDiscountModal}
          onClose={() => {
            setDisplayDiscountModal(false);
          }}
          scrollable={true}
          size="xl"
          unmountOnClose={true}
          aria-labelledby="discount modal"
        >
          <CModalHeader
            onClose={() => {
              setDisplayDiscountModal(false);
            }}
          >
            <CModalTitle id="BD-ApplyDiscountOnService">
              Apply Discount on Service.
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <BusinessServiceDiscount
              onClose={() => setDisplayDiscountModal(false)}
            />
          </CModalBody>
        </CModal>
      )}

      {/* {console.log('full path', imgUrl)} */}
      {/* {console.log('imagess', img)} */}
      <DataTable
        title="Business Services"
        fixedHeader
        // fixedHeaderScrollHeight="450px"
        customStyles={tableHeaderStyle}
        columns={columns}
        data={filterBusinessServiceData}
        pagination
        selectableRows
        onSelectedRowsChange={(e) => {
          setSelectedRows(e.selectedRows);
        }}
        highlightOnHover
        subHeader
        subHeaderComponent={
          <>
            <div className="col-md-4 col-xs-0 col-lg-6 col-sm-6 text-start">
              {selectedRows.length > 0 ? (
                <DeleteMultipleRecords rows={selectedRows} />
              ) : (
                <div>
                  {" "}
                  <CButton
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="select services to remove"
                    data-tooltip-place="right"
                    size="sm"
                    className="col-md-4"
                    color="info"
                  >
                    Remove Service
                  </CButton>
                  <Tooltip id="my-tooltip" />
                </div>
              )}
            </div>
            <div className="col-md-7 col-xs-0 col-lg-6 col-sm-6">
              <CFormInput
                type="text"
                placeholder="search by service name or price"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </>
        }
        // subHeaderAlign="center"
        // actions={<CButton>Export</CButton>}
      />
    </CContainer>
  );
};

export default BusinessServicesList;
