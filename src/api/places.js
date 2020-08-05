import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export function getPlaces(query) {
  return axios
    .get(`https://api.foursquare.com/v2/venues/search`, {
      params: {
        intent: 'global',
        client_id: 'CWAMDQBQIWM2I34NNGOXDZE4WKEKZ04KUYV3INZZNZAQNMCX',
        client_secret: '3N2LTTEKXF3AHQFWGPK1SVOE3YE4XZTAUJ1SI2BAGIIF1WZM',
        query,
        limit: 5,
        v: '20200805',
      },
    })
    .then(
      ({
        data: {
          response: { venues },
        },
      }) => venues
    );
}
