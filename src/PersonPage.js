import React, { useState, useEffect, useMemo } from "react";
import { Card, Button, message, Table, Divider } from "antd";
import { omit } from "lodash";
import { fetchPerson, confirmPerson, fetchInvoices } from "./api-service";
import { useErrors } from "./useErrors";
import { useGlobals } from "./GlobalContext";
import { Editable } from "./Editable";

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
  {
    title: "Status",
    dataIndex: "status",
  },
];
const MESSAGE_TIMEOUT = 2;

const PersonPage = () => {
  const { setLoading } = useGlobals();
  const { handleError } = useErrors();
  const [initialPerson, setInitialPerson] = useState({});
  const [person, setPerson] = useState({
    lastName: "",
    firstName: "",
    city: "",
    state: "",
    address: "",
    country: "",
    phone: "",
    postalCode: "",
    fax: "",
    email: "",
  });
  const [orderedItems, setOrderedItems] = useState([]);

  const onConfirmChanges = () => {
    confirmPerson(person)
      .then(() => {
        setInitialPerson(person);
        message.success("Person successfully updated", MESSAGE_TIMEOUT);
      })
      .catch(handleError);
  };
  const isPersonChanged = useMemo(() => {
    const keysOne = Object.keys(initialPerson);
    const keysTwo = Object.keys(person);
    if (keysOne.length !== keysTwo.length) {
      return true;
    }

    for (let key of keysOne) {
      if (initialPerson[key] !== person[key]) {
        return true;
      }
    }

    return false;
  }, [person, initialPerson]);

  useEffect(() => {
    setLoading(true);

    Promise.all([fetchPerson(), fetchInvoices()])
      .then((responses) => {
        let [
          { data: personData },
          {
            data: { value: orderedItemsFromDB },
          },
        ] = responses;

        personData = omit(personData, "@odata.context");
        setInitialPerson(personData);
        setPerson(personData);
        setOrderedItems(orderedItemsFromDB);
        setLoading(false);
      })
      .catch(handleError);
  }, []);

  const renderOrderedItems = (items) => {
    return items.map(({ ID: key, invoiceItems }) => ({
      key,
    }));
  };

  const orderedDataItems = renderOrderedItems(orderedItems);

  return (
    <>
      <Card
        style={{ borderRadius: 6 }}
        title={`${person.lastName} ${person.firstName}`}
      >
        <div>
          City:{" "}
          <Editable
            type="text"
            value={person.city}
            onChange={(city) => setPerson({ ...person, city })}
          />
        </div>
        <div>
          State:{" "}
          <Editable
            type="text"
            value={person.state}
            onChange={(state) => setPerson({ ...person, state })}
          />
        </div>
        <div>
          Address:{" "}
          <Editable
            type="text"
            value={person.address}
            onChange={(address) => setPerson({ ...person, address })}
          />
        </div>
        <div>
          Country:{" "}
          <Editable
            type="text"
            value={person.country}
            onChange={(country) => setPerson({ ...person, country })}
          />
        </div>
        <div>
          Postal code:{" "}
          <Editable
            type="text"
            value={person.postalCode}
            onChange={(postalCode) => setPerson({ ...person, postalCode })}
          />
        </div>
        <div>
          Phone:{" "}
          <Editable
            type="text"
            value={person.phone}
            onChange={(phone) => setPerson({ ...person, phone })}
          />
        </div>
        <div>
          Fax:{" "}
          <Editable
            type="text"
            value={person.fax}
            onChange={(fax) => setPerson({ ...person, fax })}
          />
        </div>
        <div>
          Email: <span style={{ fontWeight: 600 }}>{person.email}</span>
        </div>
        {isPersonChanged && (
          <Button
            type="primary"
            style={{ margin: 10, borderRadius: 6 }}
            onClick={onConfirmChanges}
          >
            Confirm changes
          </Button>
        )}
      </Card>

      {orderedDataItems && (
        <>
          <Divider orientation="left">My tracks</Divider>
          <div
            style={{ borderRadius: 6, backgroundColor: "white", padding: 10 }}
          >
            <Table
              bordered={false}
              pagination={false}
              columns={columns}
              dataSource={orderedDataItems}
              size="middle"
            />
          </div>
        </>
      )}
    </>
  );
};

export { PersonPage };
