import React, { useContext } from 'react';
import {NavLink as RRNavLink, withRouter} from "react-router-dom";
import {
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
} from 'reactstrap';
import { LoginContext } from "./loginContext";
import { MyNavBarFinal }from "./Components/Navbar/MyNavBarFinal";


const Header = () => {
  const loginContext = useContext(LoginContext);

  return (

      <MyNavBarFinal/>

  );
};

export default withRouter(Header);