const { region, sms_number, notify_cooldown_ms } = require("./config.module");
const { config, SNS } = require('aws-sdk');

// Set region
config.update({ region });

// keep track in global scope
let lastNotify;

module.exports = {
  notify: (message) => {
    const now = Date.now();
    // check to see if we've already notified within the cooldown window - if so, resolve without doing anything
    if (lastNotify && ((now - lastNotify) < notify_cooldown_ms)) return Promise.resolve(true);

    console.log(`SMS Notify: ${message}`);

    // Create promise and SNS service object
    return new SNS({ 
      apiVersion: '2010-03-31' 
    }).publish({
      Message: message,
      PhoneNumber: sms_number,
    }).promise();
  }
};