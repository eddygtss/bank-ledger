import React, {useState} from 'react';
import Main from './Main';
import { LoginContext } from './loginContext';
import {NavBar} from "./Components/Navbar/NavBar";

const App = () => {
    const [isLoggedIn, setLogin] = useState(false);

    return (
      <LoginContext.Provider value={{ isLoggedIn, setLogin }}>
        <NavBar />
        <Main />
      </LoginContext.Provider>
    );
};

export default App;