import { blockchainData } from '@imtbl/sdk';
import { ImmutableConfiguration } from '@imtbl/sdk/x';
import { applicationEnvironment } from '../config/config';

export const blockchainDataClient = new blockchainData.BlockchainData({
  baseConfig: new ImmutableConfiguration({
    environment: applicationEnvironment,
  }),
});