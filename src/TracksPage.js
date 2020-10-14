import React, { useEffect, useState } from "react";
import { debounce, isEmpty } from "lodash";
import { Input, Col, Row, Select } from "antd";
import axios from "axios";
import { Track } from "./Track";
import "./TracksPage.css";
import { useGlobals } from "./GlobalContext";
import { useErrors } from "./useErrors";

const { Search } = Input;
const { Option } = Select;

const DEBOUNCE_TIMER = 500;
const DEBOUNCE_OPTIONS = {
  leading: true,
  trailing: false,
};
const PAGE_LIMIT = 20;
// only for dev
const config = {
  headers: {
    Authorization: "Basic dXNlcjA6",
  },
};
const BROWSE_TRACKS_SERVICE = "http://localhost:4004/browse-tracks";

const constructGenresQuery = (genreIds) => {
  return !isEmpty(genreIds)
    ? " and " + genreIds.map((value) => `genre_ID eq ${value}`).join(" or ")
    : "";
};
const renderTracks = (tracks) =>
  tracks.map(({ ID, name, composer, genre, unitPrice }) => (
    <Col key={ID} className="gutter-row" span={8}>
      <Track
        name={name}
        genreName={genre.name}
        composer={composer}
        unitPrice={unitPrice}
      />
    </Col>
  ));
const renderGenres = (genres) =>
  genres.map(({ ID, name }) => (
    <Option key={ID} value={ID.toString()}>
      {name}
    </Option>
  ));

// todo useReducer
const TracksContainer = () => {
  const { setLoading } = useGlobals();
  const { handleError } = useErrors();
  const [state, setState] = useState({
    tracks: [],
    genres: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      PAGE_LIMIT: 20,
    },
    searchOptions: {
      substr: "",
      genreIds: [],
      $skip: 0,
      $top: 20,
    },
  });

  useEffect(() => {
    const countTracksReq = axios.get(
      `${BROWSE_TRACKS_SERVICE}/Tracks/$count`,
      config
    );
    const getTracksRequest = axios.get(
      `${BROWSE_TRACKS_SERVICE}/Tracks?$expand=genre&$top=${PAGE_LIMIT}`,
      config
    );
    const getGenresReq = axios.get(`${BROWSE_TRACKS_SERVICE}/Genres`, config);
    Promise.all([countTracksReq, getTracksRequest, getGenresReq])
      .then((responses) => {
        const [
          { data: totalPages },
          {
            data: { value: tracks },
          },
          {
            data: { value: genres },
          },
        ] = responses;
        setState({
          ...state,
          tracks,
          genres,
          pagination: { ...state.pagination, totalPages },
        });
        setLoading(false);
      })
      .catch(handleError);
  }, []);

  const onSearch = debounce(
    () => {
      setLoading(true);
      axios
        .get(`${BROWSE_TRACKS_SERVICE}/Tracks`, {
          ...config,
          params: {},
          paramsSerializer: () =>
            `$expand=genre&$top=${PAGE_LIMIT}&$skip=${
              state.searchOptions.$skip
            }&$filter=${
              `contains(name,'${state.searchOptions.substr}')` +
              constructGenresQuery(state.searchOptions.genreIds)
            }`,
        })
        .then((response) => {
          setState({ ...state, tracks: response.data.value });
          setLoading(false);
        })
        .catch(handleError);
    },
    DEBOUNCE_TIMER,
    DEBOUNCE_OPTIONS
  );

  const onSelectChange = (genres) => {
    setState({
      ...state,
      searchOptions: {
        ...state.searchOptions,
        genreIds: genres.map((value) => parseInt(value, 10)),
      },
    });
  };
  const onSearchChange = (event) => {
    setState({
      ...state,
      searchOptions: { ...state.searchOptions, substr: event.target.value },
    });
  };

  const trackElements = renderTracks(state.tracks);
  const genreElements = renderGenres(state.genres);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "start",
          maxWidth: 600,
          paddingBottom: 10,
        }}
      >
        <Select
          mode="multiple"
          allowClear
          style={{ marginRight: 10, borderRadius: 6 }}
          placeholder="Genres"
          onChange={(value) => onSelectChange(value)}
        >
          {genreElements}
        </Select>
        <Search
          style={{
            borderRadius: 6,
          }}
          placeholder="Search tracks"
          size="large"
          onSearch={onSearch}
          onChange={onSearchChange}
        />
      </div>
      <div>
        <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 24]}>
          {trackElements}
        </Row>
      </div>
    </>
  );
};

export { TracksContainer };
