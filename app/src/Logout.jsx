import {withRouter} from 'react-router-dom';
import React, {useEffect, useContext} from 'react';
import {callApi} from "./utils";
import { LoginContext } from "./loginContext";

const Logout = ({history, loginContext}) => {
  useEffect(() => {
    callApi('logout').then(() => {
      loginContext.setLogin(false);
      history.replace('/');
    });
  });

  return (
      <div>
        Logout
      </div>
  )
};
export default withRouter(Logout);