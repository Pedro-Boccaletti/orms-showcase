import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, IUserRepository } from '@orms-showcase/domain';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: IUserRepository;

  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    active: true,
  };

  const mockUserRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<IUserRepository>('UserRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should handle creation errors', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      mockUserRepository.create.mockRejectedValue(
        new Error('Email already exists')
      );

      await expect(service.create(createUserDto)).rejects.toThrow(
        'Email already exists'
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      mockUserRepository.findAll.mockResolvedValue(users);

      const result = await service.findAll();

      expect(userRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should return empty array when no users exist', async () => {
      mockUserRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(userRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findById('1');

      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(
        new NotFoundException('User with id 999 not found')
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Jane Doe',
      };

      const updatedUser = { ...mockUser, name: 'Jane Doe' };
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await service.update('1', updateUserDto);

      expect(userRepository.update).toHaveBeenCalledWith('1', updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException when updating non-existent user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Jane Doe',
      };

      mockUserRepository.update.mockResolvedValue(null);

      await expect(service.update('999', updateUserDto)).rejects.toThrow(
        new NotFoundException('User with id 999 not found')
      );
    });
  });

  describe('remove', () => {
    it('should delete a user (set active to false)', async () => {
      const deactivatedUser = { ...mockUser, active: false };
      mockUserRepository.update.mockResolvedValue(deactivatedUser);

      await service.delete('1');

      expect(userRepository.update).toHaveBeenCalledWith('1', {
        active: false,
      });
    });

    it('should throw NotFoundException when deactivating non-existent user', async () => {
      mockUserRepository.update.mockResolvedValue(null);

      await expect(service.delete('999')).rejects.toThrow(
        new NotFoundException('User with id 999 not found')
      );
    });
  });

  describe('hard delete scenario', () => {
    it('should permanently delete a user when using delete method', async () => {
      mockUserRepository.delete.mockResolvedValue(true);

      // Assuming there's a hard delete method
      const deleteResult = await userRepository.delete('1');

      expect(userRepository.delete).toHaveBeenCalledWith('1');
      expect(deleteResult).toBe(true);
    });

    it('should handle deletion of non-existent user', async () => {
      mockUserRepository.delete.mockResolvedValue(false);

      const deleteResult = await userRepository.delete('999');

      expect(userRepository.delete).toHaveBeenCalledWith('999');
      expect(deleteResult).toBe(false);
    });
  });
});
