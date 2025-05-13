import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Patch,
    Query,
    BadRequestException,
    Req,
} from "@nestjs/common";
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import { User } from "./user.entity";
import { Match } from "match/match.entity";
import { FindManyFilter } from "../filter/filter.dto";
import { QueryValidationPipe } from "../pipes/query-validation.pipe";
import { Role } from "../authorization/role.enum";
import { Roles } from "../authorization/role.decorator";
import { UserService } from "./user.service";
import { Public } from "authentication/public";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Types } from "mongoose";
import { ValidateObjectIdPipe } from "pipes/validate-object-id.pipe";
import { Filter } from "types/types";
import { JwtPayload } from "jsonwebtoken";
import { Petition } from "petition/petition.entity";
import { PetitionModelType, PetitionStatus } from "petition/petition.enum";
import { CreatePetitionDto, TextPetitionDto } from "petition/petition.dto";
import { PetitionService } from "petition/petition.service";

// All these endpoints are globally protected by the auth guard that requires a token

@ApiBearerAuth()
@ApiTags('users')
@Controller("users")
export class UserController {
    constructor(private userService: UserService,
        private petitionService: PetitionService
    ) { }

    /**
     * @returns
     */
    @Public()
    @Get()
    async getAll(
        @Query()
        filter: Filter,
    ) {
        const users = await this.userService.findAll(filter);
        return users;
    }
    @Get("friends-petitions")
    async getFriendsPetitions(
        @Req() request: Request
    ) {
        const { sub } = request['user'] as JwtPayload;
        return this.petitionService.findAll({
            where: {
                receiver: new Types.ObjectId(sub),
                status: PetitionStatus.Pending,
                'reference.type': PetitionModelType.friend
            }
        })

    }

    /**
     * @param id
     * @returns
     */
    @Get(":id")
    async getById(@Param("id", new ValidateObjectIdPipe()) id: string) {
        const objectId = new Types.ObjectId(id);
        const user = await this.userService.findByIdOrFail(objectId);
        return user;
    }




    @Get("search/find")
    async searchByName(@Query("name") name: string): Promise<User[]> {
        if (!name) {
            throw new NotFoundException("Debe proporcionar un término de búsqueda");
        }
        return this.userService.searchUsersbyName(name);
    }

    // Endpoint para obtener las peticiones de un usuario por su ID
    @Get(":id/petitions")
    async getUserPetitions(@Param("id", new ValidateObjectIdPipe()) userId: string) {
        return this.userService.getUserPetitions(userId);
    }

    // Obtener los partidos de un usuario
    @Get(":userId/matches")
    async getUserMatches(@Param("userId", new ValidateObjectIdPipe()) userId: string): Promise<Match[]> {
        const userWithMatches = await this.userService.getMatchesByUser(
            new Types.ObjectId(userId),
        );
        return userWithMatches; // Devolver solo los partidos del usuario
    }

    //Obtener un usuario con su lista de amigos
    @Get(":userId/friends")
    async getUserWithFriends(@Param("userId", new ValidateObjectIdPipe()) userId: string) {
        const userWithFriends = await this.userService.getUserFriends(
            new Types.ObjectId(userId),
        );
        if (!userWithFriends) {
            throw new NotFoundException("Usuario no encontrado");
        }
        return userWithFriends;
    }
    /**
     * @param createUserDto
     * @returns
     */
    @Public()
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const newUser = await this.userService.create(createUserDto);
        return newUser;
    }
    @Post("friends/:friendId")
    async inviteFriend(
        @Param("friendId", new ValidateObjectIdPipe("amigo")) friendId: string,
        @Req() request: Request,
        @Body() text: TextPetitionDto
    ) {
        const { sub } = request['user'] as JwtPayload;
        let petition: CreatePetitionDto = {
            emitter: new Types.ObjectId(new Types.ObjectId(sub)),
            receiver: new Types.ObjectId(friendId),
            reference: {
                type: PetitionModelType.friend
            },
            status: PetitionStatus.Pending
        }
        return this.petitionService.create({...petition, ...text})
    }



    /**
     * @param id
     * @param updateUserDto
     * @returns
     */
    @Put(":id")
    async update(@Param("id", new ValidateObjectIdPipe()) id: string, @Body() updateUserDto: UpdateUserDto) {
        const objectId = new Types.ObjectId(id);
        const updatedUser = await this.userService.update(objectId, updateUserDto);
        return updatedUser;
    }

    @Patch("update-push-token/:userId")
    async updatePushToken(
        @Param("userId", new ValidateObjectIdPipe()) userId: string,
        @Body("pushToken") pushToken: string,
    ): Promise<{ success: boolean; message?: string }> {
        const user = await this.userService.updatePushToken(userId, pushToken);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        return { success: true, message: "Push token actualizado" };
    }

    /**
     * @param id
     * @returns
     */
    @Delete(":id")
    @Roles(Role.Admin)
    async delete(@Param("id", new ValidateObjectIdPipe()) id: string) {
        const objectId = new Types.ObjectId(id);
        const deletedUser = await this.userService.delete(objectId);
        return deletedUser;
    }

    //eliminar a un user de friends

    @Delete(":userId/friends/:friendId")
    async removeFriend(
        @Param("userId", new ValidateObjectIdPipe("usuario")) userId: string,
        @Param("friendId", new ValidateObjectIdPipe("amigo")) friendId: string,
    ) {
        const updatedUser = await this.userService.removeFriend(
            new Types.ObjectId(userId),
            new Types.ObjectId(friendId),
        );
        if (!updatedUser) {
            throw new NotFoundException("Usuario no encontrado");
        }
        return updatedUser;
    }
}