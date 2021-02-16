const { available_code, heartbeat_ms } = require("./config.module");
const { notify } = require("./sms.module");
const { runChecks } = require("./runner.module");

function heartbeat(now = false) {
  setTimeout(async () => {
    console.log("Starting heartbeat product check ...");

    const results = await runChecks();
    const anywhere = results.find(({ fulfillment: { is_out_of_stock_in_all_store_locations } }) => !is_out_of_stock_in_all_store_locations);
    const stores = results.filter(({ fulfillment: { shipping_options } }) => shipping_options.availability_status == available_code);

    if (!stores.length && anywhere) {
      console.log("Available Online somewhere ...");
      await notify("Units available online!");
    }
    else if (stores.length) {
      console.log("Available Locally!");
      await notify(`Units available locally at StoreIds: ${ stores.map(({ storeId }) => storeId).join(", ") }`);
    }
    else {
      console.log("No available products found. :(");
    }

    console.log("Hearbeat check complete.");

    // call recursively
    heartbeat();
  }, now ? 0 : heartbeat_ms);  // fires immediately if now is true
}

heartbeat(true);