import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import axios from "axios";
import "slick-carousel/slick/slick-theme.css";
import { getBusinessessToShowCustomer } from "src/redux-features/reducers/BusinessCardToCusByBusCat";
import EduShorts from "./shortVidoes/pexel-education1.mp4";
import FitnessShort from "./shortVidoes/pexel-fitness1.mp4";
import MedicalShort from "./shortVidoes/pexel-medical1.mp4";
import InsuranceShort from "./shortVidoes/pexel-insurance1.mp4";
import RealEstateShort from "./shortVidoes/pexel-real-estate1.mp4";
import HairSaloonShort from "./shortVidoes/pexels-hair-saloon.mp4";
import TechnologyShort from "./shortVidoes/pexels-technology-support.mp4";
import EventsShort from "./shortVidoes/pexel-event1.mp4";
import AutomobileShort from "./shortVidoes/pexel-automobile1.mp4";
import FinanceShort from "./shortVidoes/pexels-finance.mp4";
import {
  CButton,
  CCard,
  CCardBody,
  CCardImageOverlay,
  CCardTitle,
  CContainer,
  CImage,
} from "@coreui/react";
import FinanceCardCarousalImage from "src/assets/images/finance-card-carousal.jpg";
import FitnessCardCarousalImage from "src/assets/images/fitness-card-carousal.jpg";
import InsuranceCardCarousalImage from "src/assets/images/insurance-card-carousal.jpg";
import MedicalCardCarousalImage from "src/assets/images/medical-card-carousal.jpg";
import RealEstateCardCarousalImage from "src/assets/images/real-estate-card-carousal.jpg";
import EducationCardCarousalImage from "src/assets/images/education-card-carousal.jpg";
import HairSaloonCardCarousalImage from "src/assets/images/hair-saloon.jpg";
import TechnologyCardCarousalImage from "src/assets/images/technology-support.jpg";
import EventCardCarousalImage from "src/assets/images/events-venues.jpg";
import AutomobileCardCarousalImage from "src/assets/images/automobile.jpg";
import { useDispatch } from "react-redux";

// when user logged in at that time user can show carousal of videos & business categories cards that user can book their slot by category
//when user wants to book slot by business category then it's current location will be going to server.
const CarousalCards = () => {
  const navigate = useNavigate();

  //this hook called only once when component load, we bring business categories from server
  useEffect(() => {
    getBusinessCategories();
  }, []);
  const dispatch = useDispatch();
  // console.log('carousal called');

  //this is state variable stores business categories.
  const [businessCategories, setBusinessCategories] = useState([]);

  //we set current location in this variable.
  const [position, setPosition] = useState({ latitude: null, longitude: null });

  //this hook gets current location of user. & stored in position variable.
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setPosition((prevValue) => ({
          ...prevValue,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);
  console.log("current lat log customer dashboard", position);

  //this two list of object we store list with server data.
  let shortVideoClipsList = [];
  let cardCarousalImagesList = [];

  console.log("business categories carousal", businessCategories);

  //this is short video clips, user can show on dashboard.
  const shortVideos = [
    HairSaloonShort,
    MedicalShort,
    InsuranceShort,
    RealEstateShort,
    FinanceShort,
    EduShorts,
    FitnessShort,
    TechnologyShort,
    EventsShort,
    AutomobileShort,
  ];

  //this is category images, using this images we diplay to user to book slot.
  const cardCarousalImages = [
    HairSaloonCardCarousalImage,
    MedicalCardCarousalImage,
    InsuranceCardCarousalImage,
    RealEstateCardCarousalImage,
    FinanceCardCarousalImage,
    EducationCardCarousalImage,
    FitnessCardCarousalImage,
    TechnologyCardCarousalImage,
    EventCardCarousalImage,
    AutomobileCardCarousalImage,
  ];

  //we extract neeeded information from business categories(which we brought from server) & creating two list of object let shortVideoClipsList = []; let cardCarousalImagesList = [];
  //we store images & category name & category id in cardCarousalImagesList = [];
  //we store short clips & category name & category id in shortVideoClipsList = [];
  if (businessCategories.length > 0) {
    businessCategories.splice(0, 1);

    if (businessCategories[0].id !== "-1") {
      businessCategories.map((categoryInfo, index) => {
        shortVideoClipsList.push({
          id: categoryInfo.id,
          categoryName: categoryInfo.name,
          url: shortVideos[index],
        });
        cardCarousalImagesList.push({
          id: categoryInfo.id,
          categoryName: categoryInfo.name,
          url: cardCarousalImages[index],
        });
      });
    }
  }

  //this function called in useEffect hook.
  async function getBusinessCategories() {
    try {
      const customerToken = localStorage.getItem("jwt-token-customer");
      const url = `${process.env.REACT_APP_API_URL}businessCategories`;
      const response = await axios.get(url, {
        headers: {
          "jwt-token-customer": customerToken,
        },
      });
      if (response.status === 200) {
        setBusinessCategories(response.data.recordset);
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

  //below two objects are for carousal setting. e.g: slidesToShow: 3,autoplaySpeed: 1000.
  const settingsForVideoCarousal = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoPlay: true,
    autoplaySpeed: 1000,
    lazyLoad: false,
    responsive: [
      {
        breakpoint: 768, // Define breakpoints for responsive design
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const settingsForCardCarousal = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoPlay: true,
    autoplaySpeed: 1000,
    lazyLoad: true,
    responsive: [
      {
        breakpoint: 768, // Define breakpoints for responsive design
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  //when user select any category to book slot then this function will call.
  function showBusinessessToCustomerDashboard(categoryID) {
    try {
      const confirmation = window.confirm(
        "you can only show business near by your location, not your entered location"
      );
      if (confirmation) {
        const customerToken = localStorage.getItem("jwt-token-customer");
        const url = `${process.env.REACT_APP_API_URL}businessListByCurrentLocation`;
        axios
          .post(
            url,
            {
              latitude: position.latitude,
              longitude: position.longitude,
              businessCategoryID: categoryID,
            },
            {
              headers: {
                "jwt-token-customer": customerToken,
              },
            }
          )
          .then((busList) => {
            if (busList.status === 200) {
              console.log("busines list by location", busList);
              if (busList.data.recordset.length === 0) {
                alert("No Business Found");
              } else {
                dispatch(getBusinessessToShowCustomer(busList.data.recordset));
                navigate("/customer-dashboard/homepage/show-businesses");
              }
            } else {
              console.log(busList.statusText);
            }
          })
          .catch((e) => {
            if (e.response.status === 401) {
              // window.alert(e.response.statusText);
              navigate("/login");
            }
          });
      }
    } catch (err) {
      console.log("business not get", err);
    }
  }
  return (
    <CContainer fluid>
      <h3>Domains We Provides</h3>
      <Slider {...settingsForVideoCarousal} className="m-0 p-0">
        {shortVideoClipsList.length > 0 &&
          shortVideoClipsList.map((video, index) => (
            <div key={index} className="pe-2">
              <video
                controls
                autoPlay
                preload="auto"
                style={{ width: "100%", height: "400px" }}
                loop
                muted
              >
                <source src={video.url} type="video/mp4" />
              </video>
              <p className="text-center">{video.categoryName}</p>
            </div>
          ))}
      </Slider>
      <br />
      <br />
      <Slider {...settingsForCardCarousal} className="m-0 p-0">
        {cardCarousalImagesList.length > 0 &&
          cardCarousalImagesList.map((images, index) => (
            <div key={index} className="text-center">
              <CCard>
                <CCardBody>
                  {/* className="cardImage" in CCardBody */}
                  <CImage
                    src={images.url}
                    height={"250px"}
                    width={"100%"}
                    alt={`card-image${images.categoryName}`}
                  />
                  <CCardImageOverlay>
                    <CCardTitle
                      style={{
                        textAlign: "center",
                        padding: "10px",
                        color: "teal",
                      }}
                    >
                      {images.categoryName}
                    </CCardTitle>
                  </CCardImageOverlay>
                </CCardBody>
              </CCard>
              <CButton
                onClick={() => showBusinessessToCustomerDashboard(images.id)}
              >
                Book Your Appointment
              </CButton>
            </div>
          ))}
      </Slider>
      <br />
    </CContainer>
  );
};

export default CarousalCards;
