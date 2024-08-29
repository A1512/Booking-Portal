import React, { useState } from "react";
import EditBusinessAndPersonalInformationModal from "./EditBusinessProfileAndPersonalInfo";
import {
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import { cilLockLocked, cilSettings, cilUser } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useNavigate } from "react-router-dom";

// import avatar8 from "src/assets/images/avatars/8.jpg";

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/login");
  };
  const [chnageProfileModal, setChangeProfileModal] = useState(false);
  const [dropdownOpenOnModalClose, setDropdownOpenOnModalClose] =
    useState(false);
  const navigateToChangePassword = () => {
    navigate("/forgot-password");
  };
  const changeBusinessProfile = () => {
    setChangeProfileModal(true);
    setDropdownOpenOnModalClose(false);
  };
  const handleModalCloseInEditProfile = () => {
    setChangeProfileModal(false);
    setDropdownOpenOnModalClose(true);
  };
  return (
    <>
      <CDropdown variant="nav-item" visible={dropdownOpenOnModalClose}>
        <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
          <CIcon icon={cilUser} size="lg" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-light fw-semibold py-2">
            Settings
          </CDropdownHeader>
          <CDropdownItem
            onClick={changeBusinessProfile}
            style={{ cursor: "pointer" }}
          >
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
          <CDropdownItem
            onClick={navigateToChangePassword}
            style={{ cursor: "pointer" }}
          >
            <CIcon icon={cilSettings} className="me-2" />
            Change Password
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem
            onClick={navigateToLogin}
            style={{ cursor: "pointer" }}
          >
            <CIcon icon={cilLockLocked} className="me-2" />
            Lock Account
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
      {chnageProfileModal && (
        <EditBusinessAndPersonalInformationModal
          changeProfileState={chnageProfileModal}
          onClose={handleModalCloseInEditProfile}
        />
      )}
    </>
  );
};

export default AppHeaderDropdown;
