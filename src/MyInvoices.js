import React, { useState, useEffect } from "react";
import { Button, message, Divider, Tag, Collapse, Table, Spin } from "antd";
import moment from "moment";
import { useErrors } from "./useErrors";
import { useGlobals } from "./GlobalContext";
import { cancelInvoice, fetchInvoices } from "./api-service";

const { Panel } = Collapse;
const MESSAGE_TIMEOUT = 2;
const INVOICE_STATUS = {
  2: {
    tagTitle: "Shipped",
    color: "green",
  },
  1: {
    tagTitle: "Submitted",
    color: "processing",
    canCancel: true,
  },
  ["-1"]: {
    tagTitle: "Cancelled",
    color: "default",
  },
};
const CANCELLED_STATUS = -1;
const DATE_TIME_FORMAT_PATTERN = "LLLL";
const INVOICE_ITEMS_COLUMNS = [
  {
    title: "Track name",
    dataIndex: "name",
  },
  {
    title: "Artist",
    dataIndex: "artistName",
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

const ExtraHeader = ({ ID, status: initialStatus }) => {
  const { loading, setLoading } = useGlobals();
  const { handleError } = useErrors();
  const [loadingHeaderId, setLoadingHeaderId] = useState();
  const [status, setStatus] = useState(initialStatus);
  const statusConfig = INVOICE_STATUS[status];

  const onCancelInvoice = (event, ID) => {
    event.stopPropagation();
    setLoading(true);
    setLoadingHeaderId(ID);
    cancelInvoice(ID)
      .then(() => {
        message.success("Invoice successfully cancelled", MESSAGE_TIMEOUT);
        setLoading(false);
        setLoadingHeaderId(undefined);
        setStatus(CANCELLED_STATUS);
      })
      .catch(handleError);
  };

  return (
    <Spin spinning={loading && loadingHeaderId === ID}>
      <Tag color={statusConfig.color}>{statusConfig.tagTitle}</Tag>
      {statusConfig.canCancel && (
        <Button
          onClick={(event) => onCancelInvoice(event, ID)}
          size="small"
          danger
        >
          Cancel
        </Button>
      )}
    </Spin>
  );
};

const MyInvoices = () => {
  const { handleError } = useErrors();
  const { setLoading } = useGlobals();
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    setLoading(true);

    fetchInvoices()
      .then((response) => {
        let {
          data: { value: invoices },
        } = response;

        setInvoices(invoices);
        setLoading(false);
      })
      .catch(handleError);
  }, []);

  const genExtra = (ID, status) => <ExtraHeader ID={ID} status={status} />;
  const renderInvoices = () => {
    return invoices.map(({ ID, status, invoiceDate, total, invoiceItems }) => {
      const invoiceItemsData = invoiceItems.map(
        ({
          ID,
          track: {
            name,
            unitPrice,
            album: {
              title: albumTitle,
              artist: { name: artistName },
            },
          },
        }) => ({
          key: ID,
          ID,
          name,
          unitPrice,
          albumTitle,
          artistName,
        })
      );

      return (
        <Panel
          header={moment(invoiceDate).format(DATE_TIME_FORMAT_PATTERN)}
          key={ID}
          extra={genExtra(ID, status)}
        >
          <div>
            <Table
              bordered={false}
              pagination={false}
              columns={INVOICE_ITEMS_COLUMNS}
              dataSource={invoiceItemsData}
              size="middle"
              footer={() => (
                <span
                  style={{ fontWeight: 600 }}
                >{`Total price: ${total}`}</span>
              )}
            />
          </div>
        </Panel>
      );
    });
  };

  const invoiceElements = renderInvoices(invoices);

  return (
    <div>
      {invoiceElements && (
        <>
          <Divider orientation="left">My invoices</Divider>
          <Collapse style={{ borderRadius: 6 }} expandIconPosition="left">
            {invoiceElements}
          </Collapse>
        </>
      )}
    </div>
  );
};

export { MyInvoices };
