import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Layout } from "antd";
import { TracksContainer } from "./TracksPage";
import { CurrentPageHeader } from "./CurrentPageHeader";
import { Header } from "./Header";
import { PersonPage } from "./PersonPage";
import { ErrorPage } from "./ErrorPage";
import { Login } from "./Login";
import { withRestrictions } from "./withRestrictions";

const { Content } = Layout;

const RestrictedLogin = withRestrictions(Login, { isAuth: false });
const RestrictedPersonPage = withRestrictions(PersonPage, {
  isAuth: true,
});

const MyRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/error">
          <ErrorPage />
        </Route>
        <Route>
          <Header />
          <Content
            className="site-layout"
            style={{ padding: "0 50px", marginTop: 20 }}
          >
            <div style={{ padding: "24px" }}>
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
                <Route>
                  <Redirect to="/error" />
                </Route>
              </Switch>
            </div>
          </Content>
        </Route>
      </Switch>
    </Router>
  );
};

export { MyRouter };
