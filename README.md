# ps5-ping
Periodically check for PS5 Availability at local Target stores

# Setup
After cloning `npm install` and *copy the `.env.example` file to `.env` and setup the variables*. Failure to do this will cause the app to fail.

## .ENV Options
`AWS_ACCESS_KEY_ID=` - from AWS IAM
`AWS_SECRET_ACCESS_KEY=` - from AWS IAM
`REGION=us-east-1`
`API_URL=https://redsky.target.com/redsky_aggregations/v1/web/pdp_fulfillment_v1?key=ff457966e64d5e877fdbad070f276d18ecec4a01`
`PRODUCTS=81114596,81114595`
`STORES=` *Comma separated Store Ids* - find in XHR calls on Target storefinder sidebar
`AVAILABLE_CODE=IN_STOCK` - code provided by merchant to indicate availability

`NOTIFY_COOLDOWN_MS=300000` - ms to wait between SMS notifications
`HEARTBEAT_MS=15000` - ms to wait between heartbeat checks

`SMS_NUMBER=+16039999999` - E.164 Formatted phone number to notify

## Running
`node main`

# Disclaimer
Use this code as your own discretion. It uses public calls to the Target API that are not restricted.