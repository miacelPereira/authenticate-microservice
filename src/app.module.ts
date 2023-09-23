import { Module } from '@nestjs/common';
import { AuthenticateModule } from './modules/authenticate/authenticate.module';

@Module({
  imports: [AuthenticateModule],
})
export class AppModule {}
