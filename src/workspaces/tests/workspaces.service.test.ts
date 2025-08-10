import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkspacesService } from '../workspaces.service';

describe('WorkspacesService', () => {
  let service: WorkspacesService;
  let prisma: PrismaService;

  const mockWorkspace = {
    id: 1,
    name: 'Test Workspace',
    createdAt: new Date(),
    pages: [],
  };

  const prismaMock = {
    workspace: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspacesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<WorkspacesService>(WorkspacesService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new workspace', async () => {
      prismaMock.workspace.findFirst.mockResolvedValue(null);
      prismaMock.workspace.create.mockResolvedValue(mockWorkspace);

      const data = { name: 'Test Workspace' };
      const result = await service.create(data);

      expect(prismaMock.workspace.findFirst).toHaveBeenCalledWith({ where: { name: data.name } });
      expect(prismaMock.workspace.create).toHaveBeenCalledWith({ data });
      expect(result).toEqual(mockWorkspace);
    });

    it('should throw error if workspace name exists', async () => {
      prismaMock.workspace.findFirst.mockResolvedValue(mockWorkspace);

      await expect(service.create({ name: 'Test Workspace' })).rejects.toThrow('Workspace name already exists');
    });
  });

  describe('findAll', () => {
    it('should return paginated workspaces', async () => {
      const query = { search: 'test', skip: 0, take: 10 };
      prismaMock.$transaction.mockResolvedValue([[mockWorkspace], 1]);

      const result = await service.findAll(query);

      expect(prismaMock.$transaction).toHaveBeenCalled();
      expect(result).toEqual({ items: [mockWorkspace], total: 1 });
    });

    it('should handle empty search', async () => {
      prismaMock.$transaction.mockResolvedValue([[mockWorkspace], 1]);

      const result = await service.findAll({});

      expect(prismaMock.$transaction).toHaveBeenCalled();
      expect(result).toEqual({ items: [mockWorkspace], total: 1 });
    });
  });

  describe('findOne', () => {
    it('should find a workspace by id', async () => {
      prismaMock.workspace.findUnique.mockResolvedValue(mockWorkspace);

      const result = await service.findOne(1);

      expect(prismaMock.workspace.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { pages: true },
      });
      expect(result).toEqual(mockWorkspace);
    });

    it('should throw error if workspace not found', async () => {
      prismaMock.workspace.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('Workspace with ID 999 not found');
    });
  });

  describe('update', () => {
    it('should update a workspace', async () => {
      prismaMock.workspace.findUnique.mockResolvedValue(mockWorkspace);
      prismaMock.workspace.update.mockResolvedValue({ ...mockWorkspace, name: 'Updated' });

      const data = { id: 1, name: 'Updated' };
      const result = await service.update(1, data);

      expect(prismaMock.workspace.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data,
      });
      expect(result.name).toBe('Updated');
    });

    it('should throw error if workspace not found', async () => {
      prismaMock.workspace.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { id: 1, name: 'Nope' })).rejects.toThrow('Workspace with ID 999 not found');
    });
  });

  describe('remove', () => {
    it('should remove a workspace', async () => {
      prismaMock.workspace.findUnique.mockResolvedValue(mockWorkspace);
      prismaMock.workspace.delete.mockResolvedValue(mockWorkspace);

      const result = await service.remove(1);

      expect(prismaMock.workspace.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockWorkspace);
    });

    it('should throw error if workspace not found', async () => {
      prismaMock.workspace.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow('Workspace with ID 999 not found');
    });
  });
});
