import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CImage,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from "@coreui/icons";

import { AppBreadcrumb } from "./index";
import { AppHeaderDropdown } from "./header/index";
import KodeTechnolabLogo from "src/assets/images/KodeTechnolab.png";
// import { logo } from 'src/assets/brand/logo';
import { setSidebarShow } from "src/redux-features/reducers/DefaultThemeSidebar.js";

const AppHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow);
  // console.log('sidebarShow State component', sidebarShow);
  // useEffect(() => {
  //   console.log('sidebarShow State', sidebarShow);
  // }, [sidebarShow]);
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => {
            // console.log('Toggler clicked');
            dispatch(setSidebarShow(!sidebarShow));
          }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="d-none" href="https://kodetechnolab.com">
          <CImage fluid align="center" src={KodeTechnolabLogo} />
        </CHeaderBrand>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
