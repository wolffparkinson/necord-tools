import { Global, Module } from '@nestjs/common';
import * as providers from './index';

const PROVIDERS = [...Object.values(providers)];

@Global()
@Module({ providers: PROVIDERS, exports: PROVIDERS })
export class DiscordClientUtilsModule {}
