import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceInput } from './dto/create-workspace-input';
import { UpdateWorkspaceInput } from './dto/update-workspace-input';
import { Workspace } from './workspace.model';

@Resolver(() => Workspace)
export class WorkspacesResolver {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Mutation(() => Workspace)
  async createWorkspace(@Args('input') input: CreateWorkspaceInput) {
    return this.workspacesService.create(input);
  }

  @Query(() => [Workspace], { name: 'workspaces' })
  async findAll() {
    return this.workspacesService.findAll();
  }

  @Query(() => Workspace, { name: 'workspace' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.workspacesService.findOne(id);
  }

  @Mutation(() => Workspace)
  async updateWorkspace(@Args('input') input: UpdateWorkspaceInput) {
    return this.workspacesService.update(input.id, input);
  }

  @Mutation(() => Workspace)
  async removeWorkspace(@Args('id', { type: () => Int }) id: number) {
    return this.workspacesService.remove(id);
  }
}