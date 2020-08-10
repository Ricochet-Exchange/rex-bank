import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Banks from "./views/Banks/Banks";
import Vault from "./views/Vault/Vault";
import FourOhFour from "./views/fourOhFour/fourOhFour";

const Routes = () => (
  <Switch>
    <Route exact path="/">
      <Redirect to="/banks" />
    </Route>
    <Route path="/banks" exact component={Banks} />
    <Route path="/vaults" exact component={Vault} />

    <Route path="*" component={FourOhFour} />
  </Switch>
);

export default Routes;
