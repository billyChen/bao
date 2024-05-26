import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupModule } from './group/group.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [GroupModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
