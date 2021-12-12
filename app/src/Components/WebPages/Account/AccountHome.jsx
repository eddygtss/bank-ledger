import React, {useEffect, useState} from 'react';
import {
    Alert,
    Button,
    Container,
    Nav,
    NavItem,
    NavLink, Offcanvas, OffcanvasBody, OffcanvasHeader,
    TabContent,
    TabPane
} from 'reactstrap';
import { AccountSummary } from './AccountSummary';
import '../Home/Home.scss';
import Buddies from "../Buddies/Buddies";
import MyProfile from "../Profile/MyProfile";
import {callApi, formatCurrency} from "../../Utils/utils";
import TransactionEntries from "../../Transactions/TransactionEntries";
import cogoToast from "cogo-toast";

const AccountHome = ({ setLogin }) => {
    const [activeTab, setActiveTab] = useState('1');
    const [reload, setReload] = useState(false);
    const [reloadAccSum, setReloadAccSum] = useState(false);
    const [bankInfo, setBankInfo] = useState({});
    const [profile, setProfile] = useState({});
    const [offCanvas, setOffCanvas] = useState(false);

    useEffect(() => {
        callApi('account').then(result => {
            if (result.status === 200) {
                result.json().then(data => {
                    setBankInfo(data);
                    callApi('profile').then(result => {
                        if (result.status === 200) {
                            result.json().then(profileData => {
                                setProfile(profileData);
                            })
                        }
                    })
                });
            } else {
                setLogin(false);
                sessionStorage.setItem("isLoggedIn", "false");
                cogoToast.error('You have been logged out.')
            }
        });
    }, [reload, reloadAccSum]);

    const toggle = (tab) => {
        if (activeTab !== tab && tab !== 'offCanvas') setActiveTab(tab);
        if (tab === 'offCanvas') {
            setOffCanvas(!offCanvas)
        }
    }


    const getPendingRequests = () => {
        return bankInfo.accountName && bankInfo.requestHistory.filter(request => {
            const status = request.requestStatus.toLowerCase();
            return status.includes('pending');
        }).length;
    }

    const showPendingRequestAlert = () => {
        if (getPendingRequests() > 0){
            return (
                <Alert color="primary">
                    You have {getPendingRequests()} pending request(s) waiting, click the View Requests button to see all current pending requests.
                </Alert>
            )
        }
    }

    return (
        <>
            <Offcanvas toggle={() => toggle('offCanvas')} isOpen={offCanvas} direction="end">
                <OffcanvasHeader toggle={() => toggle('offCanvas')}>
                    <h1 className="text-center">Requests</h1>
                </OffcanvasHeader>
                <OffcanvasBody className='p-1'>
                    {bankInfo.accountName &&
                    <TransactionEntries
                        accountInfo={bankInfo}
                        transType={'request'}
                        reload={reload}
                        setReload={setReload}
                    />
                    }
                </OffcanvasBody>
            </Offcanvas>
            <Container fluid className='px-4'>
                {bankInfo.accountName &&
                <div>
                    <h3>{bankInfo.accountName}</h3>
                    <Button className="requestBtn btn-info" onClick={() => toggle('offCanvas')}>View Requests</Button>
                    <h4>Balance: {formatCurrency(bankInfo.balance)}</h4>

                    <br/>
                </div>
                }
                {showPendingRequestAlert()}
                <Nav
                    tabs
                    className='justify-content-evenly text-center d-block'
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
                    <NavItem>
                        <NavLink
                            className={activeTab === '3' ? 'account-home-active' : 'account-home-inactive'}
                            onClick={() => {
                                toggle('3');
                                setReload(!reload);
                            }}
                        >
                            My Profile
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent className='mt-4' activeTab={activeTab}>
                    <TabPane tabId='1'>
                        <AccountSummary
                            accountInfo={bankInfo}
                            reload={reloadAccSum}
                            setReload={setReloadAccSum}
                        />
                    </TabPane>
                    <TabPane tabId='2'>
                        <Buddies reload={reload} setReload={setReload} />
                    </TabPane>
                    <TabPane tabId='3'>
                        <MyProfile profile={profile} reload={reload} setReload={setReload} />
                    </TabPane>
                </TabContent>
            </Container>
        </>
    );
}
export default AccountHome;
