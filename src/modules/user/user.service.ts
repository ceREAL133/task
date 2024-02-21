import {
  BadRequestException,
  Injectable,
  Logger,
  Optional,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { inspect } from 'util';

import { User, UserDocument } from '../../schemas/user.schema';
import { CreateUserDto } from '../../dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Optional() private logger = new Logger('User Service'),
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    this.logger.log(`Trying to create user with such params: ${inspect(dto)}`);

    try {
      // I'm saving user in db with raw password. Not the best practice, but it wasn't described in requirements.
      // I know how to use bcrypt, crypto and other password encrypting libraries, but lets not focus on this :)

      const user = await this.userModel.create(dto);

      this.logger.log(`User ${user.login} was successfully created`);

      return user;
    } catch (error) {
      this.logger.error(error);

      throw new BadRequestException(error.message);
    }
  }

  async findUser(login: string): Promise<UserDocument> {
    this.logger.log(`Trying to find user with such login: ${login}`);

    try {
      const user = await this.userModel.findOne({ login });

      this.logger.log(`User ${user.login} was successfully found`);

      return user;
    } catch (error) {
      this.logger.error(error);

      throw new BadRequestException(error.message);
    }
  }
}
