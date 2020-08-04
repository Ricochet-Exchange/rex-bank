import React from "react";
import { Switch, Route } from "react-router-dom";

import Banks from "./views/Banks/Banks";
import Vault from "./views/Vault/Vault";
import FourOhFour from "./views/fourOhFour/fourOhFour";

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Banks} />
    <Route path="/vault" exact component={Vault} />

    <Route path="*" component={FourOhFour} />
  </Switch>
);

export default Routes;
