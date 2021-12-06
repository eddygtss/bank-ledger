import React, { useState } from 'react';
import {
    Col,
    Container,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane
} from 'reactstrap';
import { AccountSummary } from '../../AccountSummary';
import './Home.scss';

const AccountHome = ({ setLogin }) => {
    const [activeTab, setActiveTab] = useState('1');

    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    return (
        <Container fluid className='px-4 myBackGround'>
            <Nav
                tabs
                className='justify-content-evenly'
            >
                <NavItem>
                    <NavLink
                        className={activeTab === '1' ? 'account-home-active' : 'account-home-inactive'}
                        onClick={() => toggle('1')}
                    >
                        Account Summary
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={activeTab === '2' ? 'account-home-active' : 'account-home-inactive'}
                        onClick={() => toggle('2')}
                    >
                        Gem Buddies
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent className='mt-4' activeTab={activeTab}>
                <TabPane tabId='1'>
                    <AccountSummary setLogin={setLogin} />
                </TabPane>
                <TabPane tabId='2'>
                    <Row className='justify-content-between text-center'>
                        <Col sm='4'>
                            <h3>Your Buddies</h3>
                            <br />
                            Coming soon...
                        </Col>
                        <Col sm='8'>
                            <h3>Buddy Feed</h3>
                            <br />
                            Coming soon...
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
        </Container>
    );
}
export default AccountHome;
