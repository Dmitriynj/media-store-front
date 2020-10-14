import React from "react";
import { Menu } from "antd";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useGlobals } from "./GlobalContext";

const keys = ["/", "/person", "/login", "manage-orders"];

const Header = () => {
  const history = useHistory();
  const { user } = useGlobals();
  const location = useLocation();
  const currentKey = [keys.find((key) => key === location.pathname)];

  return (
    <Menu theme="light" mode="horizontal" selectedKeys={currentKey}>
      <Menu.Item key="/" onClick={() => history.push("/")}>
        Browse
      </Menu.Item>
      {!user.mockedToken && (
        <Menu.Item key="/login" onClick={() => history.push("/login")}>
          Login
        </Menu.Item>
      )}

      {user.mockedToken && (
        <Menu.Item key="/person" onClick={() => history.push("/person")}>
          Profile
        </Menu.Item>
      )}
      {user && user.isAdmin && (
        <Menu.Item
          key="/manage-orders"
          onClick={() => history.push("/manage-orders")}
        >
          Manage orders
        </Menu.Item>
      )}
    </Menu>
  );
};

export { Header };
