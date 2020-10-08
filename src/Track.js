import React from "react";
import { Card } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

const Track = ({ name, composer, unitPrice, isOwned, isSelected }) => {
  return (
    <Card style={{ borderRadius: 6 }} title={name} bordered={false}>
      {composer && (
        <div>
          <span style={{ fontWeight: 600 }}>Compositor:</span> {composer}
        </div>
      )}
      <div>
        <span style={{ fontWeight: 600 }}>Price:</span> {unitPrice}
      </div>
    </Card>

    // <div style={divStyle}>
    //   <span>{name}</span>
    //   {isOwned && (
    //     <Button type="primary" shape="circle" icon={<PlusOutlined />} />
    //   )}
    //   {isSelected && <Button danger shape="circle" icon={<MinusOutlined />} />}
    // </div>
  );
};

export { Track };
