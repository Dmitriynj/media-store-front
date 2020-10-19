import { isEmpty } from "lodash";
import axios from "axios";

const BROWSE_TRACKS_SERVICE = "http://localhost:4004/browse-tracks";
const INVOICES_SERVICE = "http://localhost:4004/invoices";
const USER_SERVICE = "http://localhost:4004/user";

const constructGenresQuery = (genreIds) => {
  return !isEmpty(genreIds)
    ? " and " + genreIds.map((value) => `genre_ID eq ${value}`).join(" or ")
    : "";
};

const fetchTacks = (
  isAuthenticated = false,
  { $top = 20, $skip = 0, genreIds = [], substr = "" } = {}
) => {
  const entityName = isAuthenticated ? "MarkedTracks" : "Tracks";

  const serializeTracksUrl = () => {
    return `$expand=genre,album($expand=artist)&$top=${$top}&$skip=${$skip}&$filter=${
      `contains(name,'${substr}')` + constructGenresQuery(genreIds)
    }`;
  };

  return axios.get(`${BROWSE_TRACKS_SERVICE}/${entityName}`, {
    params: {},
    paramsSerializer: () => serializeTracksUrl(),
  });
};

const countTracks = (
  isAuthenticated = false,
  { genreIds = [], substr = "" } = {}
) => {
  const entityName = isAuthenticated ? "MarkedTracks" : "Tracks";
  return axios.get(
    `${BROWSE_TRACKS_SERVICE}/${entityName}/$count?$filter=${
      `contains(name,'${substr}')` + constructGenresQuery(genreIds)
    }`
  );
};

const fetchGenres = () => {
  return axios.get(`${BROWSE_TRACKS_SERVICE}/Genres`);
};

const invoice = (tracks) => {
  console.log(tracks);
  return axios.post(
    `${INVOICES_SERVICE}/invoice`,
    {
      tracks: tracks.map(({ unitPrice, ID }) => ({
        unitPrice: `${unitPrice}`,
        ID,
      })),
    },
    {
      headers: { "content-type": "application/json;IEEE754Compatible=true" },
    }
  );
};

const fetchUser = () => {
  return axios.get(`${USER_SERVICE}/getUser()`);
};

export { fetchTacks, countTracks, fetchGenres, invoice, fetchUser };
