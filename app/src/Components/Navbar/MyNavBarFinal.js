import React, {useContext, useState} from "react";
import { NavLink as RRNavLink, NavLink } from "react-router-dom";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, NavItem } from "reactstrap";
import "./MyNavBarFinal.css";
import { LoginContext } from "../../loginContext";
import GemLogo from "./GemLogo.png";

export const MyNavBarFinal = () => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const toggleNav = () => {
        setToggleMenu(!toggleMenu)
    }

    const loginContext = useContext(LoginContext);

    return (
        <>
            <nav className="navbar">
                <div className="nav-logo">
                    <img src={GemLogo}/>  <h1>&nbsp;Gem Bankers United</h1>
                </div>
                <div className="NavMenu">

                        <UncontrolledDropdown>
                            <DropdownToggle nav>
                                <div className="DropDownText">
                                    About Us
                                </div>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem tag={RRNavLink} exact to="/about-us" activeClassName="active">
                                    What is Gem Bankers United?
                                </DropdownItem>
                                <DropdownItem tag={RRNavLink} exact to="/contact-us" activeClassName="active">
                                    Contact Us
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>

                        <UncontrolledDropdown>
                            <DropdownToggle nav>
                                <div className="DropDownText">
                                    Transactions
                                </div>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem tag={RRNavLink} exact to="/transaction-history" activeClassName="active">
                                    <NavItem isLoggedin={loginContext.isLoggedIn}>
                                        View Transactions
                                    </NavItem>
                                </DropdownItem>

                                <DropdownItem tag={RRNavLink} exact to="/transaction-create" activeClassName="active">
                                    Create Transaction
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>

                        <UncontrolledDropdown >
                            <DropdownToggle nav>
                                <div className="DropDownText">
                                    Account
                                </div>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem tag={RRNavLink} exact to="/account-create" activeClassName="active">
                                    Register
                                </DropdownItem>
                                <DropdownItem divider/>
                                <DropdownItem tag={RRNavLink} exact to="/login" activeClassName="active">
                                    Login
                                </DropdownItem>
                                <DropdownItem tag={RRNavLink} exact to="/logout" activeClassName="active">
                                    Logout
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                </div>

            </nav>
        </>
    );
}

