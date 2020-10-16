import React from "react";
import { Card, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const Track = ({ name, composer, genreName, unitPrice, alreadyOrdered }) => {
  return (
    <Card style={{ borderRadius: 6 }} title={name} bordered={false}>
      {composer && (
        <div>
          Compositor: <span style={{ fontWeight: 600 }}>{composer}</span>
        </div>
      )}
      <div>
        Price: <span style={{ fontWeight: 600 }}>{unitPrice}</span>
      </div>
      <div>
        Genre: <span style={{ fontWeight: 600 }}>{genreName}</span>
      </div>
      {!alreadyOrdered && (
        <Button onClick={() => {}}>
          <PlusOutlined />
        </Button>
      )}
    </Card>
  );
};

export { Track };
