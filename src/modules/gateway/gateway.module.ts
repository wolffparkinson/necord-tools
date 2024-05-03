import { Module } from '@nestjs/common';
import * as events from './events';

@Module({ providers: Object.values(events) })
export class GatewayModule {}
