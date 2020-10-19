import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { fetchUser } from "./api-service";
import { useErrors } from "./useErrors";

const PersonPage = () => {
  const { handleError } = useErrors();
  const [person, setPerson] = useState({});
  console.log("person", person);

  useEffect(() => {
    fetchUser()
      .then((response) => {
        setPerson(response.data);
      })
      .catch(handleError);
  }, []);

  return (
    <Card
      style={{ borderRadius: 6, width: "50%" }}
      title={`${person.lastName} ${person.firstName}`}
    >
      <div>
        City: <span style={{ fontWeight: 600 }}>{person.city}</span>
      </div>
      <div>
        State: <span style={{ fontWeight: 600 }}>{person.state}</span>
      </div>
      <div>
        Address: <span style={{ fontWeight: 600 }}>{person.address}</span>
      </div>
      <div>
        Country: <span style={{ fontWeight: 600 }}>{person.country}</span>
      </div>
      <div>
        Postal code:{" "}
        <span style={{ fontWeight: 600 }}>{person.postalCode}</span>
      </div>
      <div>
        Postal phone: <span style={{ fontWeight: 600 }}>{person.phone}</span>
      </div>
      <div>
        Fax: <span style={{ fontWeight: 600 }}>{person.fax}</span>
      </div>
      <div>
        Email: <span style={{ fontWeight: 600 }}>{person.email}</span>
      </div>
    </Card>
  );
};

export { PersonPage };
