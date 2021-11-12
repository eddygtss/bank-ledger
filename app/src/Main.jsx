import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './Login';
import Logout from './Logout';
import AccountCreate from './AccountCreate';
import TransactionHistory from './TransactionHistory';
import TransactionCreate from './TransactionCreate';
import { LoginContext } from './loginContext';
import Home from "./Components/WebPages/Home";
import AboutUs from "./Components/WebPages/AboutUs";
import ContactUs from "./Components/WebPages/ContactUs";

// redirect user to login page if trying to access protected route and not logged in.
const ProtectedRoute = ({ isAllowed, ...props }) => isAllowed ? <Route {...props}/> : <Redirect to="/login"/>;

const Main = () => {
    const loginContext = useContext(LoginContext);

    return (
        <>
            <Switch>
                <Route exact path='/about-us' render={() => <AboutUs/> }/>
                <Route exact path='/contact-us' render={() => <ContactUs/> }/>
                <Route exact path='/' render={() => <Home/> }/>
                <Route exact path='/login' render={() => <Login/> }/>
                <Route exact path='/logout' render={() => <Logout />}/>
                <Route path='/account-create'  render={() => <AccountCreate /> } />
                <ProtectedRoute path='/transaction-history' component={TransactionHistory} isAllowed={loginContext.isLoggedIn} />
                <ProtectedRoute path='/transaction-create' component={TransactionCreate} isAllowed={loginContext.isLoggedIn} />
            </Switch>
            <Redirect to={"/"} />
        </>
    );
};

export default Main;