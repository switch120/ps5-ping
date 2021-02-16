const { stores, products, api_url } = require("./config.module");
const axios = require("axios");

module.exports = {
  runChecks: () => {
    // use flatMap so we can loop over the internal stores, producing an array of promises that will get flattened together
    return Promise.all(
      products.flatMap(product => {
        // note: not using implicit return here for readability
        return stores.map(store => {
          console.log(`Checking Product: ${product} at Store: ${store}`);
          return axios.get(`${api_url}&tcin=${product}&store_positions_store_id=${store}&has_store_positions_store_id=true&pricing_store_id=${store}`).then(resp => {
            // ammend this to the data so we can reference it later
            resp.data.storeId = store;
            return resp;
          });
        });
      })
    // we only care about the fulfillment nested attribute; map to simpler array with destructuring / implicit return
    ).then(results => results.map(({
      data: {
        storeId,
        data: {
          product: {
            fulfillment
          }
        }
      }
    }) => ({ 
      fulfillment,
      storeId
    })));
  }
};