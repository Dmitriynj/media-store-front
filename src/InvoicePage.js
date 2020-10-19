import React from "react";
import { Table, Button } from "antd";
import { uniqueId } from "lodash";
import { useGlobals } from "./GlobalContext";
import { useHistory } from "react-router-dom";
import { invoice } from "./api-service";
import { useErrors } from "./useErrors";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Artist",
    dataIndex: "artist",
  },
  {
    title: "Album",
    dataIndex: "albumTitle",
  },
  {
    title: "Price",
    dataIndex: "unitPrice",
  },
];

const InvoicePage = () => {
  const history = useHistory();
  const { handleError } = useErrors();
  const {
    invoicedItems,
    setInvoicedItems,
    setLoading,
    setNotifications,
    notifications,
  } = useGlobals();

  const data = invoicedItems.map(({ ID: key, ...otherProps }) => ({
    key,
    ...otherProps,
  }));

  const onBuy = () => {
    setLoading(true);
    invoice(
      invoicedItems.map(({ ID, unitPrice }) => ({
        ID,
        unitPrice,
      }))
    )
      .then(() => {
        setLoading(false);
        setNotifications([
          ...notifications,
          {
            type: "success",
            message: "Invoice successfully confirmed !",
            ID: uniqueId().toString(),
          },
        ]);
        setInvoicedItems([]);
        history.push("/person");
      })
      .catch(handleError);
  };
  const onCancel = () => {
    setInvoicedItems([]);
    history.push("/");
  };

  return (
    <>
      <Table
        pagination={false}
        columns={columns}
        dataSource={data}
        size="middle"
      />
      <div style={{ display: "flex", justifyContent: "flex-end", padding: 5 }}>
        <Button
          type="primary"
          size="large"
          style={{ borderRadius: 6 }}
          onClick={onBuy}
        >
          Buy
        </Button>
        <Button
          size="large"
          style={{ borderRadius: 6, marginLeft: 5 }}
          onClick={onCancel}
          danger
        >
          Cancel
        </Button>
      </div>
    </>
  );
};

export { InvoicePage };
