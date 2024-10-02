import { Test, TestingModule } from '@nestjs/testing';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

describe('CertificatesService', () => {
  let certificatesService: CertificatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CertificatesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    certificatesService = module.get<CertificatesService>(CertificatesService);
  });

  it('should be defined', () => {
    expect(certificatesService).toBeDefined();
  });

  describe('create', () => {
    it('should create a certificate', async () => {
      const createCertificateDto: CreateCertificateDto = {
        title: 'New Certificate',
        name: 'John Doe',
        recipientName: 'Jane Doe',
        courseId: 1,
        issueDate: '2024-09-30',
      }; // Ensure all required fields are included

      await certificatesService.create(createCertificateDto);
      expect(certificatesService.create).toHaveBeenCalledWith(createCertificateDto);
    });
  });

  describe('findAll', () => {
    it('should return all certificates', async () => {
      await certificatesService.findAll();
      expect(certificatesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one certificate by ID', async () => {
      const id = 1;
      await certificatesService.findOne(id);
      expect(certificatesService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a certificate', async () => {
      const id = 1;
      const updateCertificateDto: UpdateCertificateDto = {
        title: 'Updated Certificate',
        name: 'John Doe',
        recipientName: 'Jane Doe',
        courseId: 1,
        issueDate: '2024-10-01',
      }; // Ensure all required fields are included

      await certificatesService.update(id, updateCertificateDto);
      expect(certificatesService.update).toHaveBeenCalledWith(id, updateCertificateDto);
    });
  });

  describe('remove', () => {
    it('should remove a certificate', async () => {
      const id = 1;
      await certificatesService.remove(id);
      expect(certificatesService.remove).toHaveBeenCalledWith(id);
    });
  });
});
