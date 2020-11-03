import React, { useEffect, useState } from "react";
import { Form, Input, Select } from "antd";
import { head } from "lodash";
import { useSearch } from "@umijs/hooks";
import { useGlobals } from "../../GlobalContext";
import { fetchAlbumsByName, fetchGenres } from "../../api-service";
import { useErrors } from "../../useErrors";

const ALBUMS_LIMIT = 10;
const REQUIRED = [
  {
    required: true,
    message: "This filed is required!",
  },
];

const getAlbums = function (value) {
  return fetchAlbumsByName(value, ALBUMS_LIMIT)
    .then((response) => response.data.value)
    .catch(this.handleError);
};

const AddTrackForm = () => {
  const { handleError } = useErrors();
  const {
    data: albums,
    loading: isAlbumsLoading,
    onChange: onChangeAlbumInput,
    cancel: onAlbumCancel,
  } = useSearch(getAlbums.bind({ handleError }));
  const { setLoading } = useGlobals();
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchGenres(), onChangeAlbumInput()])
      .then((responses) => {
        setGenres(head(responses).data.value);
        setLoading(false);
      })
      .catch(handleError);
  }, []);

  return (
    <>
      <h3>Add track</h3>
      <Form.Item label="Name" name="name" rules={REQUIRED}>
        <Input />
      </Form.Item>
      <Form.Item label="Composer" name="composer" rules={REQUIRED}>
        <Input />
      </Form.Item>
      <Form.Item label="Album" name="albumTitle" rules={REQUIRED}>
        <Select
          showSearch
          placeholder="Select album"
          filterOption={false}
          onSearch={onChangeAlbumInput}
          loading={isAlbumsLoading}
          onBlur={onAlbumCancel}
          style={{ width: 300 }}
        >
          {albums &&
            albums.map((album) => (
              <Select.Option key={album.title}>{album.title}</Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item label="Genre" name="genreName" rules={REQUIRED}>
        <Select
          showSearch
          placeholder="Select genre"
          filterOption={false}
          onSearch={onChangeAlbumInput}
          style={{ width: 300 }}
        >
          {genres &&
            genres.map((genre) => (
              <Select.Option key={genre.name}>{genre.name}</Select.Option>
            ))}
        </Select>
      </Form.Item>
    </>
  );
};

export { AddTrackForm };
