import React, { useState } from 'react';
import {
    Container,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from 'reactstrap';
import { AccountSummary } from '../../AccountSummary';
import './Home.scss';
import Buddies from "./Buddies/Buddies";

const AccountHome = ({ setLogin }) => {
    const [activeTab, setActiveTab] = useState('1');
    const [reload, setReload] = useState(false);
    const [reloadAccSum, setReloadAccSum] = useState(false);

    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    return (
        <Container fluid className='px-4'>
            <Nav
                tabs
                className='justify-content-evenly'
            >
                <NavItem>
                    <NavLink
                        className={activeTab === '1' ? 'account-home-active' : 'account-home-inactive'}
                        onClick={() => {
                            toggle('1');
                            setReloadAccSum(!reloadAccSum);
                        }}
                    >
                        Account Summary
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={activeTab === '2' ? 'account-home-active' : 'account-home-inactive'}
                        onClick={() => {
                            toggle('2');
                            setReload(!reload);
                        }}
                    >
                        Gem Buddies
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent className='mt-4' activeTab={activeTab}>
                <TabPane tabId='1'>
                    <AccountSummary setLogin={setLogin} reload={reloadAccSum} setReload={setReloadAccSum} />
                </TabPane>
                <TabPane tabId='2'>
                    <Buddies reload={reload} setReload={setReload} />
                </TabPane>
            </TabContent>
        </Container>
    );
}
export default AccountHome;
