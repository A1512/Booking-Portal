import axios from "axios";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CCard, CCardBody, CContainer, CImage } from "@coreui/react";
import { useNavigate } from "react-router-dom";

// this component display most booked services to user.
const TrendingMostBookedServices = () => {
  const navigate = useNavigate();
  const [businessServices, setBusinessServices] = useState([]);
  useEffect(() => {
    getServicesData();
  }, []);

  //this function called in useEffect to get most booked service
  async function getServicesData() {
    try {
      const customerToken = localStorage.getItem("jwt-token-customer");
      const url = `${process.env.REACT_APP_API_URL}getBusinessServices`;
      const response = await axios.post(
        url,
        { value: null, flag: null },
        {
          headers: {
            "jwt-token-customer": customerToken,
          },
        }
      );
      if (response.status === 200) {
        // console.log('response', response.data.recordset);
        setBusinessServices(response.data.recordset);
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

  //this is carousal styling object passed in slider component.
  const settingsForCardCarousal = {
    dots: false,
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

  return (
    <CContainer fluid>
      <h3>Most Booked Services</h3>
      <Slider {...settingsForCardCarousal} className="m-0 p-0">
        {businessServices.map((images, index) => (
          <div key={index} className="text-center">
            <CCard>
              <CCardBody className="cardImage">
                <CImage
                  src={images.imageURL}
                  height={"250px"}
                  width={"100%"}
                  alt={`card-image${images.name}`}
                />
              </CCardBody>
            </CCard>
            <div>
              <ul style={{ listStyleType: "none" }} className="p-2">
                <li className="fs-6 fw-bolder text-white">{images.name}</li>
                <li>₹{images.price}</li>
              </ul>
            </div>
          </div>
        ))}
      </Slider>
    </CContainer>
  );
};

export default TrendingMostBookedServices;
