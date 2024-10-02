import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { SignupDto } from './dto/signup-auth.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token for valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const user: User = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const token = 'jwt_token';

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true); // Correctly typed mock
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await authService.login(loginDto);

      expect(result).toEqual({ accessToken: token });
      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
    });
  });

  describe('signup', () => {
    it('should create a user and return a JWT token', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      };

      const user: User = {
        id: 1,
        email: signupDto.email,
        username: signupDto.username,
        password: await bcrypt.hash(signupDto.password, 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const token = 'jwt_token';

      jest.spyOn(usersService, 'create').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await authService.signup(signupDto);

      expect(result).toEqual({ accessToken: token });
      expect(usersService.create).toHaveBeenCalledWith(signupDto);
    });
  });
});
