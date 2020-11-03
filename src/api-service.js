import { isEmpty } from "lodash";
import axios from "axios";

const BROWSE_TRACKS_SERVICE = "http://localhost:4004/browse-tracks";
const INVOICES_SERVICE = "http://localhost:4004/browse-invoices";
const USER_SERVICE = "http://localhost:4004/users";
const MANAGE_STORE = "http://localhost:4004/manage-store";

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

const fetchPerson = () => {
  return axios.get(`${USER_SERVICE}/getPerson()`);
};

const confirmPerson = (person) => {
  return axios.post(
    `${USER_SERVICE}/updatePerson`,
    {
      person,
    },
    {
      headers: { "content-type": "application/json" },
    }
  );
};

const fetchInvoices = () => {
  return axios.get(
    `${INVOICES_SERVICE}/Invoices?$expand=invoiceItems($expand=track($expand=album($expand=artist)))`
  );
};

const cancelInvoice = (ID) => {
  return axios.post(
    `${INVOICES_SERVICE}/cancelInvoice`,
    {
      ID,
    },
    {
      headers: { "content-type": "application/json" },
    }
  );
};

const fetchAlbumsByName = (substr = "", top) => {
  return axios.get(
    `${BROWSE_TRACKS_SERVICE}/Albums?$filter=${`contains(title,'${substr}')&$top=${top}`}`
  );
};

const addTrack = (data) => {
  return axios.post(`${MANAGE_STORE}/addTrack`, data, {
    headers: { "content-type": "application/json" },
  });
};

export {
  fetchTacks,
  countTracks,
  fetchGenres,
  invoice,
  fetchPerson,
  confirmPerson,
  fetchInvoices,
  cancelInvoice,
  fetchAlbumsByName,
  addTrack,
};
