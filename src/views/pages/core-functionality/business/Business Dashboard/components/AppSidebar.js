import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
  CImage,
  CLink,
} from "@coreui/react";
// import CIcon from '@coreui/icons-react';

import { AppSidebarNav } from "./AppSidebarNav";
import KodeTechnolabLogo from "src/assets/images/KodeTechnolab.png";
// import { logoNegative } from 'src/assets/brand/logo-negative';
// import { sygnet } from 'src/assets/brand/sygnet';

import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

// sidebar nav config
import navigation from "../_nav_business_dashboard";
import { setSidebarShow } from "src/redux-features/reducers/DefaultThemeSidebar";

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebar.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow);

  return (
    <CSidebar
      position="fixed"
      selfhiding="md"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(setSidebarShow(visible));
      }}
    >
      <CSidebarBrand
        className="d-none d-md-flex"
        style={{ backgroundColor: "transparent" }}
      >
        <CLink href="https://kodetechnolab.com" target="_blank">
          <CImage
            className="sidebar-brand-full"
            src={KodeTechnolabLogo}
            height={35}
          />
        </CLink>

        <CLink href="https://kodetechnolab.com" target="_blank">
          <CImage
            className="sidebar-brand-narrow"
            src={KodeTechnolabLogo}
            height={35}
          />
        </CLink>

        {/* <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} /> */}
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch(setSidebarShow(!unfoldable))}
      />
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
