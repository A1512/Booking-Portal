import React from "react";
import { Body1, Body2, Body3 } from "../../Customer Homepage Components/index";
import { CContainer } from "@coreui/react";
const CustomerHomePage = () => {
  // when customer logged in then below 3 component called. which is customer dashboard.
  return (
    <CContainer fluid>
      <Body1 />
      <br />
      <Body2 />
      <br />
      <Body3 />
    </CContainer>
  );
};

export default CustomerHomePage;
