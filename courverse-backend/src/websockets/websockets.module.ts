import { Module } from '@nestjs/common';
import { AppGateway } from './gateway/app.gateway';

@Module({
  providers: [AppGateway],
  exports: [AppGateway],
})
export class WebsocketsModule {}
