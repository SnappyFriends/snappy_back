import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './reports/reports.module';
import { PrivacyModule } from './privacy/privacy.module';

@Module({
  imports: [ReportsModule, PrivacyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
