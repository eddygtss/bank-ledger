import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    NavItem,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Collapse,
    NavLink
} from "reactstrap";
import "./NavBar.css";
import GemLogo from "./GemLogo.png";
import {withRouter} from "react-router-dom";
import {callApi} from "../../utils";
import cogoToast from "cogo-toast";

export const NavBar = ({isLoggedIn, setLogin}) => {
    const [hamburger, setHamburger] = useState(false);
    const [sendModal, setSendModal] = useState(false);
    const [requestModal, setRequestModal] = useState(false);
    const [depositModal, setDepositModal] = useState(false);
    const [withdrawModal, setWithdrawModal] = useState(false);

    const Logout = () => {
        callApi('logout', 'GET').then(result => {
            if (result.status === 200) {
                sessionStorage.setItem("isLoggedIn", "false");
                setLogin(false);
                cogoToast.success('You have been successfully logged out.')
            }
        });
    }

    const toggle = (component) => {
        switch (component) {
            case 'hamburger':
                setHamburger(!hamburger);
                break;
            case 'sendModal':
                setSendModal(!sendModal);
                break;
            case 'requestModal':
                setRequestModal(!requestModal);
                break;
            case 'depositModal':
                setDepositModal(!depositModal);
                break;
            case 'withdrawModal':
                setWithdrawModal(!withdrawModal);
                break;
        }
    }

    const showLoggedOutBtns = () => {
        if(isLoggedIn === false) {
            return (
                <>
                    <NavItem>
                        <NavLink href="/account-create">
                            Register
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/login">
                            Login
                        </NavLink>
                    </NavItem>
                </>
            )
        }
    }

    const showLoggedInBtns = () => {
        if(isLoggedIn === true) {
            return (
                <>
                    <NavItem>
                        <NavLink href="/account-summary">
                            Account
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink onClick={() => Logout()} href="/">
                            Logout
                        </NavLink>
                    </NavItem>
                </>
            )
        }
    }

    return (
            <Navbar
                light
                container="fluid"
                expand="lg"
            >
                    <NavbarBrand
                        className="me-auto"
                        href="/home"
                    >
                        <div className="nav-logo" >
                            <img src={GemLogo}  alt={"GemBank Logo"}/>
                            <h1>&nbsp;Gem Bankers United</h1>
                        </div>
                    </NavbarBrand>
                    <NavbarToggler
                        onClick={() => toggle('hamburger')}
                    />
                    <Collapse navbar isOpen={hamburger} className="justify-content-end">
                        <Nav
                            className="align-items-end"
                            navbar
                        >
                            <NavItem>
                                <NavLink href="/about-us">
                                    About Us
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/contact-us">
                                    Contact Us
                                </NavLink>
                            </NavItem>
                            {showLoggedInBtns()}
                            {showLoggedOutBtns()}
                        </Nav>
                    </Collapse>
            </Navbar>
    );
}
export default withRouter(NavBar);
