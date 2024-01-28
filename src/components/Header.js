import React from "react";

const Header = (props) => {
  // console.log("HEADER props", props);
  const cheqdUser = localStorage.getItem("imt__user");
  const { company_name: companyName } = JSON.parse(cheqdUser || "{}");

  return (
    <div className="header-wrapper">
      <div className="header-text">Bodhi AI - Cheqd</div>
      <div className="header-subtext">Traind on <b style={{fontWeight:800}}>{companyName}</b></div>
    </div>
  );
};

export default Header;
