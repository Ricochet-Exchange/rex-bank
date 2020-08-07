import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Banks from "./views/Banks/Banks";
import Vault from "./views/Vault/Vault";
import FourOhFour from "./views/fourOhFour/fourOhFour";
import { CONTRACT_ADDRESSES } from "./utils/constants";

const Routes = () => (
  <Switch>
    <Route exact path="/">
      <BaseRoute />
    </Route>
    <Route path="/bank/:contractAddress" exact component={Banks} />
    <Route path="/vault/:contractAddress" exact component={Vault} />

    <Route path="*" component={FourOhFour} />
  </Switch>
);

const BaseRoute = () => {
  return (
    <Redirect
      to={`/bank/${CONTRACT_ADDRESSES[process.env.REACT_APP_CHAIN_ID].bank}`}
    />
  );
};

export default Routes;
