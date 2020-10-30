import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { isEmpty } from "lodash";
import { TracksContainer } from "./TracksPage";
import { CurrentPageHeader } from "./CurrentPageHeader";
import { Header } from "./Header";
import { PersonPage } from "./PersonPage";
import { ErrorPage } from "./ErrorPage";
import { Login } from "./Login";
import { withRestrictions } from "./withRestrictions";
import { InvoicePage } from "./InvoicePage";
import { AddTrack } from "./AddTrack";

const RestrictedLogin = withRestrictions(Login, ({ user }) => !user);
const RestrictedInvoicePage = withRestrictions(
  InvoicePage,
  ({ user, invoicedItems }) =>
    !!user && !isEmpty(invoicedItems) && user.roles.includes("customer")
);
const RestrictedPersonPage = withRestrictions(PersonPage, ({ user }) => !!user);
const RestrictedAddTrack = withRestrictions(
  AddTrack,
  ({ user }) => !!user && user.roles.includes("employee")
);

const MyRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/error">
          <ErrorPage />
        </Route>
        <Route>
          <Header />
          <div style={{ padding: "2em 20vh" }}>
            <CurrentPageHeader />
            <Switch>
              <Route exact path={["/"]}>
                <TracksContainer />
              </Route>
              <Route exact path="/person">
                <RestrictedPersonPage />
              </Route>
              <Route exact path="/login">
                <RestrictedLogin />
              </Route>
              <Route exact path="/invoice">
                <RestrictedInvoicePage />
              </Route>
              <Route exact path="/add-track">
                <RestrictedAddTrack />
              </Route>
              <Route>
                <Redirect to="/error" />
              </Route>
            </Switch>
          </div>
        </Route>
      </Switch>
    </Router>
  );
};

export { MyRouter };
