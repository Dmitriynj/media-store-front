import React, { useState } from "react";
import { Card, Button } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useGlobals } from "./GlobalContext";

const Track = ({
  ID,
  name,
  composer,
  genreName,
  albumTitle,
  artist,
  unitPrice,
  alreadyOrdered,
  isInvoiced: isInvoicedProp,
}) => {
  const { setInvoicedItems, invoicedItems } = useGlobals();
  const [isInvoiced, setIsInvoiced] = useState(isInvoicedProp);

  const onChangedStatus = () => {
    const newInvoiced = !isInvoiced;
    console.log("changing status", newInvoiced, ID);
    if (newInvoiced) {
      setInvoicedItems([
        ...invoicedItems,
        { track_ID: ID, name, artist, albumTitle, unitPrice },
      ]);
    } else {
      setInvoicedItems(invoicedItems.filter(({ ID: curID }) => curID !== ID));
    }
    setIsInvoiced(newInvoiced);
  };
  return (
    <Card style={{ borderRadius: 6 }} title={name} bordered={false}>
      <div>
        Artist: <span style={{ fontWeight: 600 }}>{artist}</span>
      </div>
      <div>
        Album: <span style={{ fontWeight: 600 }}>{albumTitle}</span>
      </div>
      <div>
        Genre: <span style={{ fontWeight: 600 }}>{genreName}</span>
      </div>

      <div>
        {composer && (
          <span>
            Compositor: <span style={{ fontWeight: 600 }}>{composer}</span>
          </span>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>
          Price: <span style={{ fontWeight: 600 }}>{unitPrice}</span>
        </span>
        {!alreadyOrdered && (
          <Button
            type="primary"
            size="small"
            shape="circle"
            onClick={onChangedStatus}
            danger={isInvoiced}
          >
            {isInvoiced ? <MinusOutlined /> : <PlusOutlined />}
          </Button>
        )}
      </div>
    </Card>
  );
};

export { Track };
