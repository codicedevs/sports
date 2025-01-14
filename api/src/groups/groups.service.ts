import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'user/user.entity';
import { Model, ObjectId, Types } from 'mongoose';
import { Group } from './entities/group.entity';
import { PetitionService } from 'petition/petition.service';
import { PetitionModelType, PetitionStatus } from 'petition/petition.enum';
import { Filter, FilterResponse } from 'types/types';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly petitionService: PetitionService,
  ) { }
  async create(createGroupDto: CreateGroupDto) {
    const { userId, invitedUsers, ...groupData } = createGroupDto;

    // Verificar si el usuario creador existe
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }
    const group = new this.groupModel({ userId: user._id, users: [user._id], ...groupData })
    const savedGroup = await group.save()
    user.groups.push(savedGroup.id)
    await user.save();


    if (invitedUsers && invitedUsers.length > 0) {
      for (const invitedUserId of invitedUsers) {
        const invitedUser = await this.userModel.findById(invitedUserId).exec();
        if (!invitedUser) {
          throw new NotFoundException(
            `Usuario con ID ${invitedUserId} no encontrado`,
          );
        }

        // Crear la petición asegurando que receiver y group sean ObjectId
        await this.petitionService.create({
          emitter: user.id, // El creador del partido es el emisor
          receiver: new Types.ObjectId(invitedUserId), // Convertir receiver a ObjectId
          reference: {
            id: savedGroup.id,
            type: PetitionModelType.group
          },
          status: PetitionStatus.Pending,
        });
      }
    }



    return savedGroup;
  }

  async addUserToGroup(groupId: Types.ObjectId, userId: Types.ObjectId): Promise<Group> {
    const group = await this.groupModel.findById(groupId).exec()
    const user = await this.userModel.findById(userId).exec()
    if (!group && !user) {
      throw new NotFoundException("Group and User not found");
    }
    if (!group) {
      throw new NotFoundException("Group not found");
    }
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Verifica si el usuario ya está en la lista del group
    if (group.users.some((u) => u.toString() === userId.toString())) {
      throw new BadRequestException("El usuario ya está agregado al group");
    }

    group.users.push(userId);

    return group.save()
  }
  async findAll(filter: Filter): Promise<FilterResponse<Group>> {
    const results = await this.groupModel.find(filter).limit(0)
    return {
      results,
      total: await this.groupModel.countDocuments(filter)
    }
  }

  async removeUserFromGroup(
    groupId: Types.ObjectId,
    userId: Types.ObjectId,
    emitterId: Types.ObjectId
  ): Promise<Group> {
    const group = await this.groupModel.findById(groupId).exec()
    const user = await this.userModel.findById(userId).exec();
    if (!group && !user) {
      throw new NotFoundException("Group and User not found");
    }
    if (!group) {
      throw new NotFoundException("Group not found");
    }
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const groupAdmin = new Types.ObjectId(group.userId as Types.ObjectId)
    const emitterIsAdmin = emitterId.equals(groupAdmin)
    if (!emitterId.equals(userId) && !emitterIsAdmin) {
      throw new ForbiddenException("No tienes permiso para eliminar miembros de este grupo");
    }
    // Ver si es el admin el que se va del grupo
    if (emitterIsAdmin && emitterId.equals(userId)) {
      if (group.users.length <= 1) {
        throw new ForbiddenException("No puedes irte del grupo porque eres el único miembro");
      }

      //Otro pasa a ser el admin
      if (groupAdmin.equals(new Types.ObjectId(group.users[0]))) {
        group.userId = group.users[1]
      }
      else {
        group.userId = group.users[0]
      }

    }
    // Verificar si el usuario está en la lista de usuarios del grupo
    const userIndex = group.users.findIndex(
      (u) => u.toString() === userId.toString(),
    );

    if (userIndex === -1) {
      throw new BadRequestException("El usuario no está en el grupo");
    }

    // Eliminar el usuario de la lista de usuarios del grupo
    group.users.splice(userIndex, 1);

    // Guardar el grupo actualizado
    const returnGroup = await group.save();

    // Eliminar el groupId del array de grupos del usuario
    const groupIndex = user.groups?.findIndex(
      (m) => m.toString() === groupId.toString(), // Comparar como cadenas
    );

    // Remover el partido de la lista de grupos del usuario
    if (groupIndex !== -1) {
      user.groups.splice(groupIndex, 1);
    }
    // Guardar el usuario actualizado
    await user.save();


    return returnGroup

  }

  async findOne(id: Types.ObjectId): Promise<Group> {
    const group = await this.groupModel.findById(id).populate("users").exec();

    if (!group) {
      throw new NotFoundException(`Grupo #${id} not found`)
    }
    return group;
  }

  async update(id: Types.ObjectId, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const group = await this.groupModel.findByIdAndUpdate(id, updateGroupDto, { new: true }).exec();
    if (!group) {
      throw new NotFoundException(`Group #${id} not found`)
    }
    return group
  }

  async remove(id: Types.ObjectId) {
    // 1. Buscar el grupo y poblar la lista de usuarios asociados al grupo
    const group = await this.groupModel.findById(id).populate({ path: "users", select: "groups" }).exec()
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`)
    }
    // 2. Aseguramos que el campo `users` es un array de documentos completos de User
    const users = group.users as unknown as Array<
      User & { groups: Types.ObjectId[] }
    >; // Conversión explícita para evitar errores de tipo
    // 3. Para cada usuario, remover el grupo de su lista de groups y guardar cambios
    for (const user of users) {
      const groupIndex = user.groups.findIndex(
        (m) => m.toString() === id.toString(),
      );

      // Si el partido está en el array `groups`, lo eliminamos
      if (groupIndex !== -1) {
        user.groups.splice(groupIndex, 1); // Remover el partido del array de groups del usuario
        await user.save(); // Guardar los cambios en cada usuario
      }
    }
    // 4. Finalmente, eliminamos el partido de la colección `groups`
    await this.groupModel.findByIdAndDelete(id).exec();


    return `This action removes a #${id} group`;
  }

  async removerUserFromGroup(groupId: Types.ObjectId, userId: Types.ObjectId,) {
    const group = await this.groupModel.findById(groupId).exec();
    if (!group) {
      throw new NotFoundException("Grupo no encontrado");
    }

    // Buscar el usuario por su ID
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    // Verificar si el usuario está en la lista de usuarios del grupo
    const userIndex = group.users.findIndex(
      (u) => u.toString() === userId.toString(),
    );

    if (userIndex === -1) {
      throw new BadRequestException("El usuario no está en el partido");
    }

    // Eliminar el usuario de la lista de usuarios del partido
    group.users.splice(userIndex, 1);

    // Guardar el grupo actualizado
    await group.save();

    // Eliminar el groupId del array de grupos del usuario
    const groupIndex = user.groups.findIndex(
      (m) => m.toString() === groupId.toString(), // Comparar como cadenas
    );
    // Remover el grupo de la lista de grupos del usuario
    if (groupIndex !== -1) {
      user.matches.splice(groupIndex, 1);
    }
    // Guardar el usuario actualizado
    await user.save();

    return group;
  }
}
