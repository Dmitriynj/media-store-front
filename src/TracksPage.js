import React, { useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Input, Col, Row, Select } from "antd";
import axios from "axios";
import { Track } from "./Track";
import { handleError } from "./handleError";
import "./TracksPage.css";
import { useGlobals } from "./GlobalContext";

const { Search } = Input;
const { Option } = Select;
const API = "http://localhost:4004";
const ERROR_PAGES = {
  401: "/unauthorized",
  403: "/forbidden",
  500: "/internal-error",
};

// only for dev
const config = {
  headers: {
    Authorization: "Basic dXNlcjA6",
  },
};

const TracksContainer = () => {
  const [tracks, setTracks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenreIDs, setSelectedGenreIDs] = useState([]);
  const { setLoading } = useGlobals();
  const history = useHistory();
  const [isMyTracks, setIsMyStracks] = useState(false);
  const [searchValue, setSearchValue] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/browse-tracks/Tracks`, config)
      .then((response) => setTracks(response.data.value))
      .catch((error) => handleError(error, ERROR_PAGES, history.push))
      .then(() => setLoading(false));

    axios
      .get(`${API}/browse-tracks/Genres`, config)
      .then((response) => setGenres(response.data.value))
      .catch((error) => handleError(error, ERROR_PAGES, history.push))
      .then(() => setLoading(false));
  }, []);

  const onSearch = (value) => {
    setLoading(true);
    // const genreIfExists = selectedGenreIDs
    axios
      .get(`${API}/browse-tracks/Tracks?$filter=contains(name,'${value}')`, {
        ...config,
      })
      .then((response) => setTracks(response.data.value))
      .catch((error) => handleError(error, ERROR_PAGES, history.push))
      .then(() => setLoading(false));
  };

  const onSelectChange = (values) => {
    setSelectedGenreIDs(values);
  };

  const tracksElementsList = tracks
    ? tracks.map(({ ID, name, composer, unitPrice }) => {
        return (
          <Col key={ID} className="gutter-row" span={8}>
            <Track name={name} composer={composer} unitPrice={unitPrice} />
          </Col>
        );
      })
    : "Please, check your connection";

  const genresElements = genres
    ? genres.map(({ ID, name }) => {
        return (
          <Option key={ID} value={ID.toString()}>
            {name}
          </Option>
        );
      })
    : [];

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Search
          style={{
            padding: 5,
            borderRadius: 6,
            maxWidth: 400,
          }}
          placeholder="Search tracks"
          size="large"
          onSearch={onSearch}
          onChange={setSearchValue}
        />
        <Select
          mode="tags"
          style={{ padding: 5, borderRadius: 6, "min-width": 100 }}
          placeholder="Tag"
          onChange={onSelectChange}
        >
          {genresElements}
        </Select>
      </div>
      {/* <Divider orientation="left">Popular now</Divider> */}
      <div>
        <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 24]}>
          {tracksElementsList}
        </Row>
      </div>
    </>
  );
};

export { TracksContainer };
