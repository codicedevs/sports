import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User } from "./user.entity";
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import * as bcrypt from "bcryptjs";
import { FindManyFilter } from "filter/filter.dto";
import { ObjectId } from "mongodb";
import { Petition } from "petition/petition.entity";
import { Match } from "match/match.entity";
import { FindManyOptions } from "typeorm";
import { Filter } from "types/types";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Match.name) private readonly matchModel: Model<Match>,
    @InjectModel(Petition.name) private readonly petitionModel: Model<Petition>,
  ) {}

  /**
   * @returns
   */
  async findAll(options?: Filter): Promise<User[]> {
    return this.userModel.find(options);
  }

  /**
   * @param email
   * @returns
   */
  async findOneByEmailOrFail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }
    return user; // Returns the user found by email
  }

  /**
   * @param searchTerm
   * @returns
   */
  async searchUsersbyName(searchTerm: string): Promise<User[]> {
    const regex = new RegExp(searchTerm, "i");
    const users = await this.userModel.find({ name: regex }).exec();

    return users;
  }

  /**
   * @param id
   * @returns
   */
  async findByIdOrFail(id: ObjectId): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }
    return user;
  }

  //obtener todos los partidos del usuario
  async getMatchesByUser(userId: ObjectId): Promise<Match[]> {
    //buscar al user por ID y hacer populate de los partidos
    const user = await this.userModel
      .findById(userId)
      .populate({
        path: "matches", // Popula los partidos
        model: "Match", // Modelo de los partidos
        populate: {
          path: "location", // Popula la ubicación dentro de cada partido
          model: "Location", // Modelo de la location
        },
      })
      .exec();

    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }
    return user.matches as Match[];
  }

  // obtener peticiones donde el usuario es el receiver
  async getUserPetitions(userId: string): Promise<Petition[]> {
    const objectId = new Types.ObjectId(userId);
    const petitions = await this.petitionModel
      .find({ receiver: objectId })
      .populate({
        path: "match", // Popula los partidos
        model: "Match", // Modelo de los partidos
        populate: {
          path: "location", // Popula la ubicación dentro de cada partido
          model: "Location", // Modelo de la location
        },
      })
      .populate({
        path: "emitter", // Popula el campo emitter
        model: "User",
      })
      .exec();

    if (!petitions || petitions.length === 0) {
      throw new NotFoundException(
        "No se encontraron invitaciones para este usuario",
      );
    }
    return petitions;
  }

  /**
   * @param createUserDto
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 8);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return user.save(); // Saves and returns the new user
  }

  /**
   * @param id
   * @param updateUserDto
   * @returns
   */
  async update(id: ObjectId, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findByIdOrFail(id); // chequea si user existe

    // If the DTO contains a new password, hash it before updating
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 8);
      updateUserDto.password = hashedPassword;
    }

    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async updatePushToken(
    userId: string,
    pushToken: string,
  ): Promise<User | null> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { pushToken }, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  /**
   * @param id
   * @returns
   */
  async delete(id: ObjectId): Promise<User> {
    const user = await this.findByIdOrFail(id); // Ensure user exists
    await this.userModel.findByIdAndDelete(id).exec();
    return user; // Return the deleted user
  }

  async addFriend(userId: ObjectId, friendId: ObjectId): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    // No need to fetch the full friend document, just check if it's already in the list
    if (user.friends.includes(friendId)) {
      throw new BadRequestException("Este usuario ya es tu amigo");
    }

    // Add the friendId directly to the friends array
    user.friends.push(friendId);

    return user.save();
  }

  async getUserFriends(userId: ObjectId): Promise<User> {
    const user = await this.userModel
      .findById(userId)
      .populate("friends")
      .exec();
    return user;
  }

  async removeFriend(userId: ObjectId, friendId: ObjectId): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    // Filter out the friendId from the friends array
    user.friends = user.friends.filter((f) => !f.equals(friendId));

    return user.save();
  }
}
