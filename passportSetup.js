const passportInstance = new passport.Passport({
    baseConfig: {
      environment: config.environment,
      publishableKey: config.publishableKey,
    },
    clientId: config.clientId,
    redirectUri: config.redirectUri,
    logoutRedirectUri: config.logoutRedirectUri,
    audience: config.audience,
    scope: config.scope,
  });

  const passportProvider = passportInstance.connectEvm();

