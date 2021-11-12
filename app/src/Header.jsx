import React from 'react';
import { withRouter } from "react-router-dom";
import { MyNavBarFinal }from "./Components/Navbar/MyNavBarFinal";


const Header = () => {

  return (

      <MyNavBarFinal/>

  );
};

export default withRouter(Header);