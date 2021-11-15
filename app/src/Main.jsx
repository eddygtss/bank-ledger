import React, { useContext } from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Login from './Login';
import Logout from './Logout';
import AccountCreate from './AccountCreate';
import AccountSummary from './AccountSummary';
import TransactionCreate from './TransactionCreate';
import { LoginContext } from './loginContext';
import Home from "./Components/WebPages/Home";
import AboutUs from "./Components/WebPages/AboutUs";
import ContactUs from "./Components/WebPages/ContactUs";

// redirect user to login page if trying to access protected route and not logged in.
const ProtectedRoute = ({ isAllowed, ...props }) => isAllowed ? <Route {...props}/> : <Redirect to="/login"/>;

const Main = () => {
    const loginContext = useContext(LoginContext);
    console.log(loginContext);

    return (
        <>
            <Switch>
                <Route
                    exact
                    path="/"
                    render={() => {
                        return (
                            loginContext.isLoggedIn ?
                                <Redirect to="/account-summary" /> :
                                <Redirect to="/home" />
                        )
                    }}
                />
                <Route exact path='/about-us' component={AboutUs}/>
                <Route exact path='/contact-us' component={ContactUs}/>
                <Route exact path='/home' component={Home}/>
                <Route exact path='/login' render={() => <Login loginContext={loginContext}/> }/>
                <Route exact path='/logout' render={() => <Logout loginContext={loginContext} />}/>
                <Route exact path='/account-create'  render={() => <AccountCreate loginContext={loginContext}/> } />
                <ProtectedRoute exact path='/account-summary' component={AccountSummary} isAllowed={loginContext.isLoggedIn} />
                <ProtectedRoute exact path='/transaction-create' component={TransactionCreate} isAllowed={loginContext.isLoggedIn} />
            </Switch>
        </>
    );
};

export default Main;