import React from "react";
import { Breadcrumb, Spin, Alert } from "antd";
import { useLocation } from "react-router-dom";
import { useGlobals } from "./GlobalContext";

const names = {
  "/": "Browse / Tracks",
  "/person": "Profile",
  "/login": "Login form",
  "/invoice": "Requested items",
};

const CurrentPageHeader = () => {
  const location = useLocation();
  const { loading, notifications, setNotifications } = useGlobals();

  const onCloseAlert = (ID) => {
    setNotifications(notifications.filter(({ ID: curID }) => curID === ID));
  };

  const notificationElements = notifications.map(({ ID, message, type }) => {
    return (
      <Alert
        key={ID}
        message={message}
        type={type}
        showIcon
        closable
        onClose={() => onCloseAlert(ID)}
        style={{ margin: "10px 0", borderRadius: 6 }}
      />
    );
  });

  return (
    <>
      <Breadcrumb
        style={{ height: 50, paddingBottom: 20, fontWeight: 600, fontSize: 20 }}
      >
        <Breadcrumb.Item>
          {names[location.pathname]}
          <span style={{ padding: 10 }}>{loading && <Spin />}</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      {notificationElements}
    </>
  );
};

export { CurrentPageHeader };
