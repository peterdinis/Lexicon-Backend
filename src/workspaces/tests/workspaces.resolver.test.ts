import { Test, TestingModule } from '@nestjs/testing';
import { WorkspacesResolver } from '../workspaces.resolver';
import { WorkspacesService } from '../workspaces.service';

describe('WorkspacesResolver', () => {
  let resolver: WorkspacesResolver;
  let service: WorkspacesService;

  const mockWorkspace = { id: 1, name: 'Test Workspace' };
  const mockPaginated = { items: [mockWorkspace], total: 1 };

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspacesResolver,
        { provide: WorkspacesService, useValue: serviceMock },
      ],
    }).compile();

    resolver = module.get<WorkspacesResolver>(WorkspacesResolver);
    service = module.get<WorkspacesService>(WorkspacesService);

    jest.clearAllMocks();
  });

  it('should create workspace', async () => {
    serviceMock.create.mockResolvedValue(mockWorkspace);
    const input = { name: 'Test Workspace' };

    const result = await resolver.createWorkspace(input);
    expect(serviceMock.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockWorkspace);
  });

  it('should find all workspaces', async () => {
    serviceMock.findAll.mockResolvedValue(mockPaginated);

    const result = await resolver.findAll({});
    expect(serviceMock.findAll).toHaveBeenCalledWith({});
    expect(result).toEqual(mockPaginated);
  });

  it('should find one workspace', async () => {
    serviceMock.findOne.mockResolvedValue(mockWorkspace);

    const result = await resolver.findOne(1);
    expect(serviceMock.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockWorkspace);
  });

  it('should update workspace', async () => {
    serviceMock.update.mockResolvedValue(mockWorkspace);
    const input = { id: 1, name: 'Updated' };

    const result = await resolver.updateWorkspace(input);
    expect(serviceMock.update).toHaveBeenCalledWith(input.id, input);
    expect(result).toEqual(mockWorkspace);
  });

  it('should remove workspace', async () => {
    serviceMock.remove.mockResolvedValue(mockWorkspace);

    const result = await resolver.removeWorkspace(1);
    expect(serviceMock.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockWorkspace);
  });
});
