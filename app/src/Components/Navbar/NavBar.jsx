import React, {useContext, useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
    NavItem,
    Nav,
    Navbar,
    NavbarBrand, NavbarToggler, Collapse, NavLink, Container
} from "reactstrap";
import { LoginContext } from "../../loginContext";
import "./NavBar.css";
import GemLogo from "./GemLogo.png";
import {RequestFundsModal} from "../Modal/RequestFundsModal";
import {DepositFundsModal} from "../Modal/DepositFundsModal";
import {SendFundsModal} from "../Modal/SendFundsModal";
import {withRouter} from "react-router-dom";

export const NavBar = () => {
    const [hamburger, setHamburger] = useState(false);
    const [sendModal, setSendModal] = useState(false);
    const [requestModal, setRequestModal] = useState(false);
    const [depositModal, setDepositModal] = useState(false);
    const [withdrawModal, setWithdrawModal] = useState(false);

    const loginContext = useContext(LoginContext);

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
        if(!loginContext.isLoggedIn) {
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
        if(loginContext.isLoggedIn) {
            return (
                <>
                    <UncontrolledDropdown
                        inNavbar
                        nav
                    >
                        <DropdownToggle
                            caret
                            nav
                        >
                            Transactions
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem onClick={() => toggle('requestModal')}>
                                Request
                                <RequestFundsModal requestModal={requestModal} setRequestModal={setRequestModal}/>
                            </DropdownItem>
                            <DropdownItem onClick={() => toggle('depositModal')}>
                                Deposit
                                <DepositFundsModal depositModal={depositModal} setDepositModal={setDepositModal}/>
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem onClick={() => toggle('sendModal')}>
                                Send
                                <SendFundsModal sendModal={sendModal} setSendModal={setSendModal}/>
                            </DropdownItem>
                            <DropdownItem onClick={() => toggle('withdrawModal')}>
                                Withdraw
                                <SendFundsModal withdrawModal={withdrawModal} setWithdrawModal={setWithdrawModal}/>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <NavItem>
                        <NavLink href="/logout">
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
                        href="/"
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
                            className="mr-right align-items-end"
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
