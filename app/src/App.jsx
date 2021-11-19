import React, { useState } from 'react';
import Main from './Main';
import { NavBar } from "./Components/Navbar/NavBar";

const App = () => {
    const [isLoggedIn, setLogin] = useState(sessionStorage.getItem("isLoggedIn") === "true")

    return (
        <>
            <NavBar isLoggedIn={isLoggedIn} setLogin={setLogin} />
            <Main setLogin={setLogin} isLoggedIn={isLoggedIn} />
        </>
    );
};

export default App;