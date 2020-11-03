import React, { useState, useMemo } from "react";
import { Form, Radio, Button } from "antd";
import { AddTrackForm } from "./AddTrackForm";
import { useErrors } from "../../useErrors";
import { useGlobals } from "../../GlobalContext";
import { addTrack } from "../../api-service";

const FORM_TYPES = {
  track: "track",
};

const chooseForm = (type) => {
  return type === "track" && <AddTrackForm />;
};

const ManageStore = () => {
  const [form] = Form.useForm();
  const { handleError } = useErrors();
  const { setLoading } = useGlobals();
  const [formType, setFormType] = useState("track");

  const formElement = useMemo(() => chooseForm(formType), [formType]);

  const onChangeForm = (event) => {
    setFormType(event.target.value);
  };

  const sendCreateRequest = ({ type, ...others }) => {
    if (type === FORM_TYPES.track) {
      console.log("others", others);
      setLoading(true);
      addTrack({ ...others })
        .then(() => setLoading(false))
        .catch(handleError);
    }
  };

  return (
    <>
      <Form
        form={form}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        initialValues={{
          type: formType,
        }}
        type={formType}
        onFinish={sendCreateRequest}
        onFinishFailed={() => console.log("Not valid params provided")}
      >
        <Form.Item label="Entity" name="type">
          <Radio.Group onChange={onChangeForm}>
            <Radio.Button value="track">Track</Radio.Button>
            <Radio.Button value="album">Album</Radio.Button>
            <Radio.Button value="artist">Artist</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {formElement}
        <Form.Item
          type="primary"
          wrapperCol={{
            span: 14,
            offset: 4,
          }}
        >
          <Button onClick={() => form.submit()}>Create</Button>
        </Form.Item>
      </Form>
    </>
  );
};

export { ManageStore };
