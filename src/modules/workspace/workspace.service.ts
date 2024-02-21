import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import { Workspace, WorkspaceDocument } from '../../schemas/workspace.schema';
import { WorkspaceDto } from '../../dto/workspace.dto';
import { RequestWithUser } from '../../guards/auth.guard';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace.name) private workspaceModel: Model<Workspace>,
    @Optional() private logger = new Logger('Workspace Service'),
  ) {}

  async getWorkspaces(userId: string): Promise<WorkspaceDocument[]> {
    try {
      return this.workspaceModel.aggregate([
        {
          $match: {
            userId,
          },
        },
        {
          $lookup: {
            from: 'messages',
            let: { workspaceIdString: { $toString: '$_id' } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$workspaceId', '$$workspaceIdString'],
                  },
                },
              },
            ],
            as: 'messages',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            messages: {
              _id: 1,
              date: 1,
              likes: 1,
              content: 1,
            },
          },
        },
      ]);
    } catch (error) {
      this.logger.error(error);

      throw new BadRequestException(error.message);
    }
  }

  async getUsersWorkspaces(userId: string): Promise<WorkspaceDocument[]> {
    return await this.workspaceModel.find({ userId });
  }

  async createWorkspace(
    dto: WorkspaceDto,
    req: RequestWithUser,
  ): Promise<Workspace> {
    try {
      const { user } = req;

      this.logger.log(`Creating workspace for user: ${user.login}`);

      return await this.workspaceModel.create({ ...dto, userId: user._id });
    } catch (error) {
      this.logger.error(error);

      throw new BadRequestException(error.message);
    }
  }

  async getWorkspaceById(id: string, req: RequestWithUser): Promise<Workspace> {
    try {
      const { user } = req;

      this.logger.log(`Getting workspace ${id}`);

      const workspace = await this.workspaceModel
        .findOne({
          _id: id,
          userId: user._id,
        })
        .exec();

      if (!workspace) {
        throw new NotFoundException(
          "Workspace wasn't found or you don't have a permission for this action",
        );
      }

      return workspace;
    } catch (error) {
      this.logger.error(error);

      throw new BadRequestException(error.message);
    }
  }

  async editWorkspaceById(
    id: ObjectId,
    body: WorkspaceDto,
    req: RequestWithUser,
  ): Promise<Workspace> {
    try {
      const { user } = req;

      this.logger.log(`Editting workspace ${id}`);

      const workspace = await this.workspaceModel.findOneAndUpdate(
        { _id: id, userId: user._id },
        body,
        { new: true },
      );

      if (!workspace) {
        throw new NotFoundException(
          "Workspace wasn't found or you don't have a permission to change it",
        );
      }

      return workspace;
    } catch (error) {
      this.logger.error(error);

      throw new BadRequestException(error.message);
    }
  }

  async deleteWorkspaceById(
    id: ObjectId,
    req: RequestWithUser,
  ): Promise<Workspace> {
    try {
      const { user } = req;

      this.logger.log(`Deletting workspace ${id}`);

      const workspace = await this.workspaceModel.findOneAndDelete({
        _id: id,
        userId: user._id,
      });

      if (!workspace) {
        throw new NotFoundException(
          "Workspace wasn't found or you don't have a permission to delete it",
        );
      }

      return workspace;
    } catch (error) {
      this.logger.error(error);

      throw new BadRequestException(error.message);
    }
  }
}
