import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { isValidObjectId, PaginateModel, PaginateResult } from 'mongoose';
import { UpdatePasswordDTO } from './etc/update-password.dto';
import { CreateUserDTO } from './etc/create-user.dto';
import { UpdateUserDTO } from './etc/update-user.dto';
import { UpdateMeDTO } from './etc/update-me.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RoleTypes } from '@enums/roles.enum';
import { auth } from 'firebase-admin';
import * as bcrypt from 'bcryptjs';
import * as _ from 'lodash';
import { User } from '@user/etc/user.schema';

// noinspection DuplicatedCode
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly model: PaginateModel<User>,
  ) {}

  async getAll(index: number): Promise<PaginateResult<User>> {
    return this.model.paginate(
      {},
      {
        sort: { createdAt: -1 },
        page: Number(index) + 1,
        projection: { password: 0 },
      },
    );
  }

  async getByID(id: string): Promise<User> {
    if (!isValidObjectId(id)) throw new BadRequestException();

    const exist = await this.model.findOne({ _id: id });

    if (!exist) throw new NotFoundException();

    return exist;
  }

  async getByPhoneNumber(phone: string): Promise<User> {
    return this.model.findOne({ phone });
  }

  async create(createDTO: CreateUserDTO): Promise<any> {
    const firebaseUser = await auth().getUser(createDTO.uid);

    if (!firebaseUser)
      throw new NotFoundException('Telefon doğrulaması tamamlanamamadı.');

    if (firebaseUser.phoneNumber !== `+90${createDTO.phone}`)
      throw new UnprocessableEntityException(
        'Bu telefon numarası ile kullanıcı eşleşmiyor.',
      );

    const exist = await this.model.exists({ email: createDTO.email });
    if (exist)
      throw new UnprocessableEntityException(
        'Bu email adresi ile başka bir kullanıcı kayıtlı.',
      );

    const exist2 = await this.model.exists({ phone: createDTO.phone });
    if (exist2)
      throw new UnprocessableEntityException(
        'Bu telefon numarası ile başka bir kullanıcı kayıtlı.',
      );

    createDTO.role = RoleTypes.USER;
    const model = new this.model(createDTO);

    model.password = await bcrypt.hash(model.password, 10);
    model.role = RoleTypes.USER;

    await model.save();

    return model;
  }

  async update(id: string, updateDTO: UpdateUserDTO): Promise<User> {
    if (!isValidObjectId(id)) throw new BadRequestException();

    const exist = await this.model.findOne({ _id: id });

    if (!exist) throw new NotFoundException();

    if (updateDTO.password) {
      updateDTO.password = await bcrypt.hash(`${updateDTO.password}`, 10);
    }

    await this.model.updateOne({ _id: id }, updateDTO, { new: true });

    return this.model.findOne({ _id: id }, { password: 0 });
  }

  async updateMe(id: string, updateDTO: UpdateMeDTO): Promise<User> {
    if (!isValidObjectId(id)) throw new BadRequestException();

    const emailExist = await this.model.findOne({
      email: updateDTO.email,
      _id: { $ne: id },
    });

    if (emailExist)
      throw new UnprocessableEntityException(
        'Bu email adresi ile başka bir kullanıcı kayıtlı.',
      );

    await this.model.updateOne({ _id: id }, updateDTO, { new: true });

    return this.model.findOne({ _id: id }, { password: 0 });
  }

  async updateMyPassword(
    user: User,
    updateDTO: UpdatePasswordDTO,
  ): Promise<User> {
    if (!isValidObjectId(user._id)) throw new BadRequestException();

    const exist = await this.model.findOne({ _id: user._id });

    if (!exist) throw new NotFoundException();

    if (!(await bcrypt.compare(updateDTO.oldPassword, user.password)))
      throw new UnprocessableEntityException('Mevcut şifre yanlış.');

    if (updateDTO.newPassword === updateDTO.newPasswordRepeat) {
      const newPassword = await bcrypt.hash(`${updateDTO.newPassword}`, 10);
      if (bcrypt.compare(updateDTO.oldPassword, exist.password)) {
        await this.model.updateOne(
          { _id: user._id },
          { password: newPassword },
          { new: true },
        );
        return this.model.findOne({ _id: user._id }, { password: 0 });
      } else
        throw new UnprocessableEntityException(
          'Yeni şifre, şuankinden farklı olmalıdır.',
        );
    } else
      throw new UnprocessableEntityException('Yeni şifreniz eşleşmiyor.  ');
  }

  async delete(id: string): Promise<boolean> {
    if (!isValidObjectId(id)) throw new BadRequestException();

    const exist = await this.model.findOne({ _id: id });

    if (!exist) throw new NotFoundException();

    await this.model.deleteOne({ _id: id });

    return true;
  }

  async getMe(user: User): Promise<any> {
    return _.pick<User>(user, [
      '_id',
      'name',
      'surname',
      'phone',
      'email',
      'role',
      'defaultAddress',
      'defaultStore',
    ]);
  }

  async patchDefaultAddress(userID: string, addressID: string) {
    await this.model.updateOne({ _id: userID }, { defaultAddress: addressID });
    return true;
  }
}
