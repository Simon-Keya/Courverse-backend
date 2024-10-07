import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
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

  describe('login', () => {
    it('should return a JWT token for valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user = {
        id: 1,
        email: loginDto.email,
        password: 'hashedPassword',
      };
      const token = 'jwt_token';

      // Mock the findByEmail and sign methods before calling the login method
      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
      (jwtService.sign as jest.Mock).mockReturnValue(token);

      const result = await authService.login(loginDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(result).toEqual({ access_token: token });
    });
  });

  describe('signup', () => {
    it('should create a user and return a JWT token', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      };
      const user = {
        id: 1,
        email: signupDto.email,
        username: signupDto.username,
        password: 'hashedPassword',
      };
      const token = 'jwt_token';

      (usersService.create as jest.Mock).mockResolvedValue(user);
      (jwtService.sign as jest.Mock).mockReturnValue(token);

      const result = await authService.signup(signupDto);

      // Adjust the expectation to match the returned object structure
      expect(result).toEqual({
        id: user.id,
        email: user.email,
        username: user.username,
        access_token: token,
      });
    });
  });
});
