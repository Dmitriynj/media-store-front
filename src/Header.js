import React from "react";
import { Menu, Badge } from "antd";
import { isEmpty } from "lodash";
import {
  CreditCardOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useGlobals } from "./GlobalContext";
import "./Header.css";

const keys = ["/", "/person", "/login", "/add-track", "/invoice"];

const Header = () => {
  const history = useHistory();
  const { getUser, invoicedItems, setUser } = useGlobals();
  const location = useLocation();
  const currentKey = [keys.find((key) => key === location.pathname)];
  const haveInvoicedItems = !isEmpty(invoicedItems);
  const invoicedItemsLength = invoicedItems.length;
  const user = getUser();

  console.log("invoiced items in header", invoicedItems);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        paddingLeft: "15vh",
        paddingRight: "15vh",
        background: "white",
      }}
    >
      <Menu
        theme="light"
        mode="horizontal"
        style={{ width: "50%" }}
        selectedKeys={currentKey}
      >
        <Menu.Item key="/" onClick={() => history.push("/")}>
          Browse
        </Menu.Item>

        {user.isAuth && (
          <Menu.Item key="/person" onClick={() => history.push("/person")}>
            Profile
          </Menu.Item>
        )}
        {user.isAuth && user.isAdmin && (
          <Menu.Item
            key="/add-track"
            onClick={() => history.push("/add-track")}
          >
            Manage orders
          </Menu.Item>
        )}
      </Menu>

      <Menu
        style={{ width: "50%", display: "flex", justifyContent: "flex-end" }}
        theme="light"
        mode="horizontal"
        selectedKeys={currentKey}
      >
        {haveInvoicedItems && (
          <Menu.Item
            style={{
              width: 40,
              display: "flex",
              justifyContent: "center",
            }}
            onClick={() => history.push("/invoice")}
            key="/invoice"
          >
            <div
              style={{
                height: "100%",
              }}
            >
              <Badge
                size="default"
                style={{ backgroundColor: "#2db7f5" }}
                count={invoicedItemsLength}
              >
                <CreditCardOutlined style={{ fontSize: 16 }} />
              </Badge>
            </div>
          </Menu.Item>
        )}

        {user.isAuth ? (
          <Menu.Item
            onClick={() => setUser({})}
            danger
            icon={<LogoutOutlined style={{ fontSize: 16 }} />}
          ></Menu.Item>
        ) : (
          <Menu.Item
            key="/login"
            onClick={() => history.push("/login")}
            icon={<LoginOutlined style={{ fontSize: 16 }} />}
          ></Menu.Item>
        )}
      </Menu>
    </div>
  );
};

export { Header };
