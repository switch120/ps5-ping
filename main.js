const { available_code, heartbeat_ms } = require("./config.module");
const { notify } = require("./sms.module");
const { runTargetChecks, runWalmartCheck } = require("./runner.module");

function heartbeat(now = false) {
  setTimeout(async () => {
    console.log("Starting heartbeat product checks ...");

    const [targetResults = [], walmartResults = []] = await Promise.all([
      runTargetChecks(),
      runWalmartCheck()
    ]);

    const anywhere = targetResults.find(({ fulfillment: { is_out_of_stock_in_all_store_locations } }) => !is_out_of_stock_in_all_store_locations);
    const stores = targetResults.filter(({ fulfillment: { shipping_options } }) => shipping_options.availability_status == available_code);

    if (!stores.length && anywhere) {
      await notify("[TARGET] Units available online!");
    }
    else if (stores.length) {
      await notify(`[TARGET] Units available locally at StoreIds: ${ stores.map(({ storeId }) => storeId).join(", ") }`);
    }
    
    if (walmartResults.length) {
      await notify("[WALMART] Units available online");
    }

    if (!walmartResults.length && !stores.length) {
      console.log("No available products found. :(");
    }

    console.log("Hearbeat check complete.");

    // call recursively
    heartbeat();
  }, now ? 0 : heartbeat_ms);  // fires immediately if now is true
}

heartbeat(true);