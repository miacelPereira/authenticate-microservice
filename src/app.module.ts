import { Module } from '@nestjs/common';
import { AuthenticationModule } from './modules/authentication/authentication.module';

@Module({
  imports: [AuthenticationModule],
})
export class AppModule {}
