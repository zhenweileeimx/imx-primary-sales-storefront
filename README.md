# Primary Sale Storefront + Primary Sales Widget

This is a sample application for setting up a Primary Sales Storefront on Immutable zkEVM using the Immutable Primary Sales Widget. This should be used to feature the products that you wish to sell as well as configure and integrate with the Primary Sales widget to facilitate fiat and crypto payment flows.

This application is meant to be used alongside the [Primary Sales Backend code](https://github.com/ZacharyCouchman/primary-sales-backend)

<img src="./PrimarySalesStorefront-Diagram.png">

## Disclaimer

The sample code provided is for reference purposes only and is not officially supported by Immutable. It has undergone best effort testing by Immutable to ensure basic functionality. However, it is essential that you thoroughly test this sample code within your own environment to confirm its functionality and reliability before deploying it in a production setting. Immutable disclaims any liability for any issues that arise due to the use of this sample code. By using this sample code, you agree to perform due diligence in testing and verifying its suitability for your applications.

## Prerequisites

- Node v18, npm v10

## Get Started

Install the latest version of the @imtbl/sdk.

```bash
npm install @imtbl/sdk
npm i
```

## Add configuration

Rename .env.example to .env, replace all of the variables with your own project variables from https://hub.immutable.com.

| Variable | Description |
| ------------ | ----------- |
| *_ENVIRONMENT | The environment you want to configure the Checkout widgets and Passport for. 'sandbox' will use Immutable zkEVM Testnet, 'production' for Immutable zkEVM Mainnet |
|*_IMMUTABLE_PUBLISHABLE_KEY | The publishable API key from your project in https://hub.immutable.com |
| *_PASSPORT_CLIENT_ID | The Passport client id from your project in https://hub.immutable.com |
| *_PASSPORT_LOGIN_REDIRECT_URI | The login redirect uri that you have configured in your project in https://hub.immutable.com. A route in this project should match the redirect route and handle the passport login callback. (See src/routes/PassportRedirect.tsx ) |
| *_PASSPORT_LOGOUT_REDIRECT_URI| The logout redirect uri that you have configured in your project in https://hub.immutable.com |
| *_PRIMARY_SALE_BACKEND_URL| The base URL the your Primary Sale Backend API is hosted at. |
| *_HUB_ENVIRONMENT_ID| The environment id of your project and environment combination found in the URL of Immutable Hub. (The Second UUID in the URL is your environment id when you select project and environment combination in the Hub) e.g `https://hub.immutable.com/projects/b8dd8d92-bbf7-4482-81e1-1e14ff4cc730/0b532cc9-5e02-412b-89e9-b5233b4d185f/collections`|


## Start

`npm run dev`

## Passport login flow

After setting up your passport clientId and redirect variables, make sure that you have a route to handle the redirect. The component at this route should use the passport instance to call `loginCallback()`. This example has the PassportRedirect component set up on the route `/passport-redirect` but this will need to be setup on the route that you have configured as your _PASSPORT_LOGIN_REDIRECT_URI . See how it is added to the React Router in main.tsx.

## Gotchas

In order to build for production, a package `jsbi` had to be installed to support one of the dependencies. The alias had to be added to the resovle section of the `vite.config.ts` file.

## Deployment in Vercel

A `vercel.json` file has been added to help configure for deployments in Vercel. This is not neccessary if you are not deploying to Vercel. It is re-writing all routes back to the index.html file to make the React Router work correctly.

## UI Kit: Chakra UI

- [Chakra UI Docs](https://v2.chakra-ui.com/)
- [Github](https://github.com/chakra-ui/chakra-ui)
- [Additional Examples](https://chakra-templates.vercel.app/)