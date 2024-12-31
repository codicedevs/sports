import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from 'user/user.entity';
import { Location } from 'locations/location.entity';
import { Match } from './match.entity';
import { PetitionService } from 'petition/petition.service';
import { NotFoundException } from '@nestjs/common';
import { CreateMatchDto } from './match.dto';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

describe('MatchService', () => {
  let service: MatchService;

  beforeAll(async () => {
    // Conectar a la base de datos real
    const mongoUri = process.env.DB_URI || 'mongodb://localhost:27017/furbotest';
    await mongoose.connect(mongoUri)

    // Configuración del módulo de pruebas
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: getModelToken(Match.name),
          useValue: mongoose.model(Match.name, new mongoose.Schema({})),
        },
        {
          provide: getModelToken(User.name),
          useValue: mongoose.model(User.name, UserSchema),
        },
        {
          provide: getModelToken(Location.name),
          useValue: mongoose.model(Location.name, new mongoose.Schema({})),
        },
        {
          provide: PetitionService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MatchService>(MatchService);
  });

  afterAll(async () => {
    // Limpiar la base de datos después de las pruebas
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMatch', () => {
    it('should create a match successfully', async () => {
      // Arrange
      const createMatchDto: CreateMatchDto = {
        userId: new Types.ObjectId("123456789123456789112233"),
        invitedUsers: ['invitedUser1', 'invitedUser2'],
        location: new Types.ObjectId("123456789123456789112233"),
        date: '2024-12-10T18:00:00',
        name: "aa",
        playersLimit: 22
      };

      // Crear un usuario y una ubicación para la prueba
      const mockUser = new User({ _id: 'userId123', matches: [] });
      const mockLocation = new Location({ _id: 'locationId123', matches: [] });

      await mockUser.save();
      await mockLocation.save();

      // Act
      const result = await service.createMatch(createMatchDto);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result.users).toContain('userId123');
      expect(result.location.toString()).toEqual('locationId123');
      expect(result.date).toEqual('2024-12-10T18:00:00');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      // Arrange
      const createMatchDto: CreateMatchDto = {
        userId: new Types.ObjectId("123456789123456789112233"),
        invitedUsers: ['invitedUser1', 'invitedUser2'],
        location: new Types.ObjectId("123456789123456789112233"),
        date: '2024-12-10T18:00:00',
        name: "aa",
        playersLimit: 22
      };

      // Act & Assert
      await expect(service.createMatch(createMatchDto)).rejects.toThrowError(new NotFoundException('Usuario no encontrado'));
    });

    it('should throw NotFoundException if location does not exist', async () => {
      // Arrange
      const createMatchDto: CreateMatchDto = {
        userId: new Types.ObjectId("123456789123456789112233"),
        invitedUsers: ['invitedUser1', 'invitedUser2'],
        location: new Types.ObjectId("123456789123456789112233"),
        date: '2024-12-10T18:00:00',
        name: "aa",
        playersLimit: 22
      };

      // Crear un usuario pero no la ubicación
      const mockUser = new User({ _id: 'userId123', matches: [] });
      await mockUser.save();

      // Act & Assert
      await expect(service.createMatch(createMatchDto)).rejects.toThrowError(new NotFoundException('Ubicación no encontrada'));
    });
  });
});
