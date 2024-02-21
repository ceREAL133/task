import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Message } from '../../schemas/message.schema';
import { CreateMessageDto } from '../../dto/create-message.dto';
import { RequestWithUser } from '../../guards/auth.guard';
import { WorkspaceService } from '../workspace/workspace.service';
import { ChangeMessageDto } from '../../dto/change-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private workspaceService: WorkspaceService,
    @Optional() private logger = new Logger('Messages Service'),
  ) {}

  async getMessages(): Promise<Message[]> {
    return await this.messageModel.find().exec();
  }

  async createMessage(
    dto: CreateMessageDto,
    req: RequestWithUser,
  ): Promise<Message> {
    try {
      this.logger.log(
        `Trying to create message for user: ${req.user.login} and workspace: ${dto.workspaceId}`,
      );

      const workspace = await this.workspaceService.getWorkspaceById(
        dto.workspaceId,
        req,
      );

      if (!workspace) {
        throw new BadRequestException(
          "Workspace wasn't found, cannot create message",
        );
      }

      return await this.messageModel.create({ ...dto, date: new Date() });
    } catch (error) {
      this.logger.error(error);

      throw new BadRequestException(error.message);
    }
  }

  async changeMessage(
    dto: ChangeMessageDto,
    messageId: string,
    req: RequestWithUser,
  ): Promise<Message> {
    try {
      this.logger.log(`Trying to change message ${messageId}`);

      const usersWorkspaces = await this.workspaceService.getUsersWorkspaces(
        req.user._id,
      );

      const usersWorkspacesIds = usersWorkspaces.map((workspace) =>
        workspace._id.toString(),
      );

      const changedMessage = await this.messageModel.findOneAndUpdate(
        { _id: messageId, workspaceId: { $in: usersWorkspacesIds } },
        { ...dto },
      );

      if (!changedMessage) {
        throw new ForbiddenException("You cannot change other users' messages");
      }

      this.logger.log(`Message ${messageId}, was successfuly updated`);

      return changedMessage;
    } catch (error) {
      this.logger.error(error);

      throw new BadRequestException(error.message);
    }
  }

  async deleteMessage(
    messageId: string,
    req: RequestWithUser,
  ): Promise<Message> {
    try {
      this.logger.log(`Trying to delete message ${messageId}`);

      const usersWorkspaces = await this.workspaceService.getUsersWorkspaces(
        req.user._id,
      );

      const usersWorkspacesIds = usersWorkspaces.map((workspace) =>
        workspace._id.toString(),
      );

      const deletedMessage = await this.messageModel.findOneAndDelete({
        _id: messageId,
        workspaceId: { $in: usersWorkspacesIds },
      });

      if (!deletedMessage) {
        throw new NotFoundException(
          "Message wasn't found or you don't have a permission to delete it",
        );
      }

      this.logger.log(`Message ${messageId}, was successfuly deleted`);

      return deletedMessage;
    } catch (error) {
      this.logger.error(error);

      throw new BadRequestException(error.message);
    }
  }
}
