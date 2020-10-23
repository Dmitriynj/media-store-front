import React, { useState, useEffect, useMemo } from "react";
import { Card, Button } from "antd";
import { uniqueId, omit } from "lodash";
import { fetchPerson, confirmPerson } from "./api-service";
import { useErrors } from "./useErrors";
import { useGlobals } from "./GlobalContext";
import { Editable } from "./Editable";

const PersonPage = () => {
  const { setLoading, setNotifications, notifications } = useGlobals();
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

  console.log(person);

  console.log("person", person);

  const onConfirmChanges = () => {
    confirmPerson(person)
      .then(() => {
        setNotifications([
          ...notifications,
          {
            type: "success",
            message: "Person successfully updated!",
            ID: uniqueId().toString(),
          },
        ]);
        console.log(person, "some123");
        setInitialPerson(person);
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
    fetchPerson()
      .then((response) => {
        const personData = omit(response.data, "@odata.context");
        setInitialPerson(personData);
        setPerson(personData);
        setLoading(false);
      })
      .catch(handleError);
  }, []);

  return (
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
  );
};

export { PersonPage };
