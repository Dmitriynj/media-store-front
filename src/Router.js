import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import { Result, Button, Layout } from "antd";
import { TracksContainer } from "./TracksPage";
import { CurrentPageHeader } from "./CurrentPageHeader";
import { Header } from "./Header";

const { Content } = Layout;

const ErrorPage = ({ status, message }) => {
  const history = useHistory();

  const onGoHome = () => {
    history.push("/");
  };

  return (
    <Result
      status={status}
      title={status}
      subTitle={message}
      extra={
        <Button onClick={onGoHome} type="primary">
          Back Home
        </Button>
      }
    />
  );
};

const MyRouter = () => {
  return (
    <Router>
      <Header />
      <Content
        className="site-layout"
        style={{ padding: "0 50px", marginTop: 20 }}
      >
        <div style={{ padding: "24px" }}>
          <CurrentPageHeader />
          <Switch>
            <Route exact path="/">
              <TracksContainer />
            </Route>
            {/* <Route path="/confirm/:token" /> */}
            <Route path="/internal-error">
              <ErrorPage
                status={500}
                message={"Sorry, something went wrong."}
              />
            </Route>
            <Route path="/forbidden">
              <ErrorPage
                status={403}
                message={"Sorry, you are not able to get this resourse."}
              />
            </Route>
            <Route path="/unauthorized">
              <ErrorPage
                status={"error"}
                message={
                  "401, Sorry, you are not authorized to access this page."
                }
              />
            </Route>
            <Route path="/error">
              <ErrorPage
                status={"error"}
                message={"Sorry, something went wrong"}
              />
            </Route>
            <Route>
              <ErrorPage
                status={404}
                message={"Sorry, the page you visited does not exist."}
              />
            </Route>
          </Switch>
        </div>
      </Content>
    </Router>
  );
};

export { MyRouter };
