import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    NavItem,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Collapse,
    NavLink, Row, Col
} from 'reactstrap';
import './NavBar.css';
import GemLogo from './GemLogo.png';
import cogoToast from 'cogo-toast';
import { callApi } from '../../utils';

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
                        <NavLink href="/register">
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
                        <NavLink href="/account-home">
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
                expand="lg"
                className="pl-0"
            >
                <div className="container-fluid justify-content-center">
                    <NavbarBrand
                        className="me-auto"
                        href="/home"
                    >
                        <Row xs="1" sm="2" md="2" className="nav-logo">
                            <Col style={{maxWidth: "fit-content"}}>
                                <img src={GemLogo}  alt={"GemBank Logo"}/>
                            </Col>
                            <Col style={{maxWidth: "fit-content"}}>
                                <h1 className='website-title'>Gem Bankers United</h1>
                            </Col>
                        </Row>
                    </NavbarBrand>
                    <NavbarToggler
                        onClick={() => toggle('hamburger')}
                    />
                    <Collapse navbar isOpen={hamburger} className="justify-content-end">
                        <Nav
                            className="align-items-center"
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
                </div>
            </Navbar>
    );
}
export default withRouter(NavBar);
