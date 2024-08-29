import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
  CImage,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import { AppSidebarNav } from "./AppSidebarNav";

// import { logoNegative } from 'src/assets/brand/logo-negative';
import { sygnet } from "src/assets/brand/sygnet";

import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import KodeTechnolabLogo from "src/assets/images/KodeTechnolab.png";
// sidebar nav config
import navigation from "../_nav";
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
        to="https://kodetechnolab.com"
        style={{ backgroundColor: "transparent", cursor: "pointer" }}
      >
        <CImage
          className="sidebar-brand-full"
          src={KodeTechnolabLogo}
          height={35}
        />
        <CImage
          className="sidebar-brand-narrow"
          src={KodeTechnolabLogo}
          height={35}
        />

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
