import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { Workspace, WorkspaceSchema } from '../../schemas/workspace.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Workspace.name, schema: WorkspaceSchema },
    ]),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, JwtService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
