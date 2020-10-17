import React, { useState } from "react";
import { Table, Button, Result } from "antd";
import { SmileOutlined } from "@ant-design/icons";

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
  const { invoicedItems, setInvoicedItems, setLoading } = useGlobals();
  const [isInvoiceCompleted, setIsInvoiceCompleted] = useState(false);

  const data = invoicedItems.map(({ track_ID: key, ...otherProps }) => ({
    key,
    ...otherProps,
  }));
  console.log("data", data);

  const onBuy = () => {
    setLoading(true);
    invoice(
      invoicedItems.map(({ track_ID, unitPrice }) => ({
        track_ID,
        unitPrice,
      }))
    )
      .then(() => {
        setIsInvoiceCompleted(true);
        setLoading(false);
        setInvoicedItems([]);
      })
      .catch(handleError);
  };
  const onCancel = () => {
    setInvoicedItems([]);
    history.push("/");
  };

  return (
    <div>
      {isInvoiceCompleted ? (
        <Result
          icon={<SmileOutlined />}
          title="Great, we have done all the operations!"
          extra={
            <Button type="primary" onClick={() => history.push("/person")}>
              Check my track list
            </Button>
          }
        />
      ) : (
        <>
          <Table
            pagination={false}
            columns={columns}
            dataSource={data}
            size="middle"
          />
          <div
            style={{ display: "flex", justifyContent: "flex-end", padding: 5 }}
          >
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
      )}
    </div>
  );
};

export { InvoicePage };
