import { Test, TestingModule } from '@nestjs/testing';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

describe('CertificatesController', () => {
  let certificatesController: CertificatesController;
  let certificatesService: CertificatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CertificatesController, // Ensure this is properly formatted
      ],
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

    certificatesController = module.get<CertificatesController>(CertificatesController);
    certificatesService = module.get<CertificatesService>(CertificatesService);
  });

  it('should be defined', () => {
    expect(certificatesController).toBeDefined();
  });

  describe('create', () => {
    it('should call CertificatesService.create with correct parameters', async () => {
      const createCertificateDto: CreateCertificateDto = {
        title: 'Sample Certificate',
        name: 'Sample Name',
        recipientName: 'Recipient Name',
        courseId: 1,
        issueDate: '2024-09-30',
      };

      await certificatesController.create(createCertificateDto);
      expect(certificatesService.create).toHaveBeenCalledWith(
        createCertificateDto,
      );
    });
  });

  describe('findAll', () => {
    it('should call CertificatesService.findAll', async () => {
      await certificatesController.findAll();
      expect(certificatesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call CertificatesService.findOne with correct parameters', async () => {
      const id = '1';
      await certificatesController.findOne(+id); // Ensure id is a number
      expect(certificatesService.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('update', () => {
    it('should call CertificatesService.update with correct parameters', async () => {
      const id = '1';
      const updateCertificateDto: UpdateCertificateDto = {
        title: 'Updated Certificate',
        name: 'Updated Name',
        recipientName: 'Updated Recipient Name',
        courseId: 1,
        issueDate: '2024-09-30',
      };

      await certificatesController.update(+id, updateCertificateDto);
      expect(certificatesService.update).toHaveBeenCalledWith(
        +id,
        updateCertificateDto,
      );
    });
  });

  describe('remove', () => {
    it('should call CertificatesService.remove with correct parameters', async () => {
      const id = '1';
      await certificatesController.remove(+id);
      expect(certificatesService.remove).toHaveBeenCalledWith(+id);
    });
  });
});
