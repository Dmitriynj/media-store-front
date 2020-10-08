import React from "react";
import { Breadcrumb, Spin } from "antd";
import { useLocation } from "react-router-dom";
import { useGlobals } from "./GlobalContext";

const names = {
  "/": "Browse / Tracks",
  "/account": "Account",
  "/manage": "Manage Orders",
};

const CurrentPageHeader = () => {
  const location = useLocation();
  const { loading } = useGlobals();

  return (
    <Breadcrumb style={{ margin: "16px  " }}>
      <Breadcrumb.Item>{names[location.pathname]}</Breadcrumb.Item>
      <Breadcrumb.Item>{loading && <Spin />}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export { CurrentPageHeader };
