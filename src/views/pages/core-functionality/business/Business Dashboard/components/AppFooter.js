import React from "react";
import { CFooter, CLink } from "@coreui/react";

const AppFooter = () => {
  return (
    <CFooter className="justify-content-center">
      <p>
        &copy; 2025{" "}
        <CLink
          href="https://kodetechnolab.com/"
          className="text-decoration-none text-secondary "
          target="_blank"
        >
          Kode Technolab
        </CLink>
        &nbsp; All Rights Reserved.
      </p>
    </CFooter>
  );
};

export default React.memo(AppFooter);
