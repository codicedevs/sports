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
import { ObjectId } from "mongodb";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

// All these endpoints are globally protected by the auth guard that requires a token

@Public()
@ApiBearerAuth()
@ApiTags('users')
@Controller("users")
export class UserController {
    constructor(private userService: UserService) { }

    /**
     * @returns
     */
    @Get()
    async getAll(
        @Query(QueryValidationPipe)
        options: FindManyFilter<User>,
    ) {
        const users = await this.userService.findAll(options);
        return users;
    }

    /**
     * @param id
     * @returns
     */
    @Get(":id")
    async getById(@Param("id") id: string) {
        if (!ObjectId.isValid(id)) {
            throw new BadRequestException("ID inválido");
        }
        const objectId = new ObjectId(id);
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
    async getUserPetitions(@Param("id") userId: string) {
        if (!ObjectId.isValid(userId)) {
            throw new BadRequestException("ID de usuario inválido");
        }

        return this.userService.getUserPetitions(userId);
    }

    // Obtener los partidos de un usuario
    @Get(":userId/matches")
    async getUserMatches(@Param("userId") userId: string): Promise<Match[]> {
        if (!ObjectId.isValid(userId)) {
            throw new BadRequestException("ID de usuario inválido");
        }

        const userWithMatches = await this.userService.getMatchesByUser(
            new ObjectId(userId),
        );
        return userWithMatches; // Devolver solo los partidos del usuario
    }

    //Obtener un usuario con su lista de amigos
    @Get(":userId/friends")
    async getUserWithFriends(@Param("userId") userId: string) {
        if (!ObjectId.isValid(userId)) {
            throw new BadRequestException("ID de usuario inválido");
        }
        const userWithFriends = await this.userService.getUserFriends(
            new ObjectId(userId),
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

    // Agregar un amigo
    @Post(":userId/friends/:friendId")
    async addFriend(
        @Param("userId") userId: string,
        @Param("friendId") friendId: string,
    ) {
        if (!ObjectId.isValid(userId) || !ObjectId.isValid(friendId)) {
            throw new BadRequestException("ID de usuario o amigo inválido");
        }
        const updatedUser = await this.userService.addFriend(
            new ObjectId(userId),
            new ObjectId(friendId),
        );

        return updatedUser;
    }

    /**
     * @param id
     * @param updateUserDto
     * @returns
     */
    @Put(":id")
    async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        if (!ObjectId.isValid(id)) {
            throw new BadRequestException("ID inválido");
        }
        const objectId = new ObjectId(id);
        const updatedUser = await this.userService.update(objectId, updateUserDto);
        return updatedUser;
    }

    @Patch("update-push-token/:userId")
    async updatePushToken(
        @Param("userId") userId: string,
        @Body("pushToken") pushToken: string,
    ): Promise<{ success: boolean; message?: string }> {
        if (!ObjectId.isValid(userId)) {
            throw new BadRequestException("ID de usuario inválido");
        }
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
    async delete(@Param("id") id: string) {
        if (!ObjectId.isValid(id)) {
            throw new BadRequestException("ID inválido");
        }
        const objectId = new ObjectId(id);
        const deletedUser = await this.userService.delete(objectId);
        return deletedUser;
    }

    //eliminar a un user de friends

    @Delete(":userId/friends/:friendId")
    async removeFriend(
        @Param("userId") userId: string,
        @Param("friendId") friendId: string,
    ) {
        if (!ObjectId.isValid(userId) || !ObjectId.isValid(friendId)) {
            throw new BadRequestException("ID de usuario o amigo inválido");
        }

        const updatedUser = await this.userService.removeFriend(
            new ObjectId(userId),
            new ObjectId(friendId),
        );
        if (!updatedUser) {
            throw new NotFoundException("Usuario no encontrado");
        }
        return updatedUser;
    }
}