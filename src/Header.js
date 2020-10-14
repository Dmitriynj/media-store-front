import React, { useState } from "react";
import { Menu } from "antd";
import { useHistory } from "react-router-dom";

const Header = () => {
  const history = useHistory();
  const [selectedKeys, setSelectedKeys] = useState(["1"]);

  return (
    <Menu theme="light" mode="horizontal" selectedKeys={selectedKeys}>
      <Menu.Item
        key="1"
        onClick={() => {
          setSelectedKeys(["1"]);
          history.push("/");
        }}
      >
        Browse
      </Menu.Item>

      <Menu.Item
        key="2"
        onClick={() => {
          setSelectedKeys(["2"]);
          history.push("/person");
        }}
      >
        Profile
      </Menu.Item>
      <Menu.Item key="3" onClick={() => history.push("/manage-orders")}>
        Manage orders
      </Menu.Item>
    </Menu>
  );
};

export { Header };
