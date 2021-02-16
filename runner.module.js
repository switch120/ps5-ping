const { target, walmart } = require("./config.module");
const axios = require("axios");

module.exports = {
  runTargetChecks: () => {
    // use flatMap so we can loop over the internal stores, producing an array of promises that will get flattened together
    return Promise.all(
      target.products.flatMap(product => {
        // note: not using implicit return here for readability
        return target.stores.map(store => {
          console.log(`Checking Product: ${product} at Store: ${store}`);
          return axios.get(`${target.api_url}&tcin=${product}&store_positions_store_id=${store}&has_store_positions_store_id=true&pricing_store_id=${store}`).then(resp => {
            // ammend this to the data so we can reference it later
            resp.data.storeId = store;
            return resp;
          }).catch(err => {
            console.log(`Error loading Target product data. Bailing out. Err: ${err}`);
            return null;
          });
        });
      })
      // we only care about the fulfillment nested attribute; map to simpler array with destructuring / implicit return
    ).then(results => results.filter(r => !!r).map(({
      data: {
        storeId,
        data: {
          product: {
            fulfillment = {}
          }
        }
      }
    }) => ({
      fulfillment,
      storeId
    })));
  },
  runWalmartCheck: () => {
    return Promise.all(
      walmart.products.map(product => {
        console.log(`Checking Walmart product: ${product} (${walmart.pdp_url}/${product})`);
        return axios.get(`${walmart.pdp_url}/${product}`, { 
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36' 
          }  
        }).catch(err => {
          console.log(`Error fetching Walmart product. Bailing out. Err: ${err}`);
          return { data: null };
        }).then(({ data }) => data && !data.match(/<b>out of stock<\/b>/));
      })
    ).then(results => results.filter(r => r));
  }
};