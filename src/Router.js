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

const { Content } = Layout;

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
                  <PersonPage />
                </Route>
                <Route exact path="/login">
                  <Login />
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
