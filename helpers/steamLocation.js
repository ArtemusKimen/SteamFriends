const fs = require('fs');
const path = require('path');

const countries = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'steam_countries.min.json')));

function find(loccountrycode, locstatecode = null, loccityid = null) {
  let params;
  if (typeof loccountrycode === 'object') {
    params = {...loccountrycode}; // Destructuring for shallow copy
    loccityid = params.loccityid;
    locstatecode = params.locstatecode;
    loccountrycode = params.loccountrycode;
  }

  const result = {};
  const mapSearchArray = [];

  const country = countries[loccountrycode?.toString()]; // Optional chaining

  if (country) {
    mapSearchArray.unshift(result.loccountry = country.name);
    result.coordinates = country.coordinates;
    result.coordinates_accuracy_level = country.coordinates_accuracy_level;  


    if (locstatecode) {
      const state = country.states?.[locstatecode?.toString()]; // Optional chaining

      if (state) {
        mapSearchArray.unshift(result.locstate = state.name);
        if (state.coordinates) {
          result.coordinates = state.coordinates;
          result.coordinates_accuracy_level = state.coordinates_accuracy_level;  

        }

        if (loccityid) {
          const city = state.cities?.[loccityid?.toString()]; // Optional chaining

          if (city) {
            mapSearchArray.unshift(result.loccity = city.name);
            if (city.coordinates) {
              result.coordinates = city.coordinates;
              result.coordinates_accuracy_level = city.coordinates_accuracy_level;  

            }
          }
        }
      }
    }
  }

  result.map_search_string = mapSearchArray.join(', ');
  return result;
}

module.exports = { find };
