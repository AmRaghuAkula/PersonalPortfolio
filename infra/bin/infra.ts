#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { InfraStack } from '../lib/infra-stack';

const app = new cdk.App();
new InfraStack(app, 'InfraStack', {
  // Pinned explicitly: the project spec requires us-east-1 (N. Virginia) --
  // it's the confirmed region for Amazon Connect Outbound Campaigns and
  // where Amplify hosting already lives. Do not fall back to ambient CLI
  // config, which may point at a different default region.
  env: { account: '340529311367', region: 'us-east-1' },
});
