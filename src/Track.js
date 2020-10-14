import React from "react";
import { Card } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

const Track = ({
  name,
  composer,
  genreName,
  unitPrice,
  isOwned,
  isSelected,
}) => {
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
    </Card>
  );
};

export { Track };
