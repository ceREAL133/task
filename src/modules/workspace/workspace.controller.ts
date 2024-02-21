import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Req,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { Workspace } from '../../schemas/Workspace.schema';
import { WorkspaceService } from './workspace.service';
import { AuthGuard } from '../../guards/auth.guard';
import { WorkspaceDto } from '../../dto/workspace.dto';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async getWorkspaces(@Req() req): Promise<Workspace[]> {
    return await this.workspaceService.getWorkspaces(req.user._id);
  }

  @UseGuards(AuthGuard)
  @Post('/createWorkspace')
  async createWorkspace(
    @Body() dto: WorkspaceDto,
    @Req() req,
  ): Promise<Workspace> {
    return await this.workspaceService.createWorkspace(dto, req);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getWorkspaceById(@Param('id') id, @Req() req): Promise<Workspace> {
    return await this.workspaceService.getWorkspaceById(id, req);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async editWorkspaceById(
    @Param('id') id,
    @Req() req,
    @Body() body,
  ): Promise<Workspace> {
    return await this.workspaceService.editWorkspaceById(id, body, req);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteWorkspaceById(@Param('id') id, @Req() req): Promise<Workspace> {
    return await this.workspaceService.deleteWorkspaceById(id, req);
  }
}
