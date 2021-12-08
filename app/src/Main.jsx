import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './Login';
import Registration from './Registration';
import TransactionCreate from './TransactionCreate';
import Home from "./Components/WebPages/Home";
import AboutUs from "./Components/WebPages/AboutUs";
import ContactUs from "./Components/WebPages/ContactUs";
import AccountHome from "./Components/WebPages/AccountHome";
import Footer from "./Components/Footer/Footer";

// redirect user to login page if trying to access protected route and not logged in.
const ProtectedRoute = ({ isAllowed, ...props }) => isAllowed ? <Route {...props}/> : <Redirect to="/login"/>;

const Main = ({ setLogin, isLoggedIn }) => {
    return (
        <div className='myBackGround'>
            <Switch>
                <Route
                    exact
                    path="/"
                    render={() => {
                        return (
                            isLoggedIn ?
                                <Redirect to="/account-home" /> :
                                <Redirect to="/home" />
                        )
                    }}
                />
                <Route exact path='/about-us' render={() => <AboutUs />}/>
                <Route exact path='/contact-us' render={() => <ContactUs />}/>
                <Route exact path='/home' render={() => <Home isLoggedIn={isLoggedIn} />}/>
                <Route exact path='/login' render={() => <Login setLogin={setLogin} />}/>
                <Route exact path='/register' render={() => <Registration setLogin={setLogin}/>}/>
                <ProtectedRoute exact path='/account-home' isAllowed={isLoggedIn} render={() => <AccountHome setLogin={setLogin} />}/>
                <ProtectedRoute exact path='/transaction-create' component={TransactionCreate} isAllowed={isLoggedIn} />
            </Switch>
            <Footer />
        </div>
    );
};

export default Main;