import { Module } from '@nestjs/common';
import { AuthenticateModule } from './authenticate/authenticate.module';

@Module({
  imports: [AuthenticateModule],
})
export class AppModule {}
