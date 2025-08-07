import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WorkspacesService } from './workspaces.service';
import { WorkspaceQueryInput } from './dto/workspace-query.input';
import { WorkspacePaginated } from './dto/workspace-paginated.output';
import { CreateWorkspaceInput } from './dto/create-workspace-input';
import { UpdateWorkspaceInput } from './dto/update-workspace-input';
import { Workspace } from './workspace.model';

@Resolver(() => Workspace)
export class WorkspacesResolver {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Mutation(() => Workspace)
  createWorkspace(@Args('input') input: CreateWorkspaceInput) {
    return this.workspacesService.create(input);
  }

  @Query(() => WorkspacePaginated, { name: 'workspaces' })
  findAll(@Args('query', { nullable: true }) query?: WorkspaceQueryInput) {
    return this.workspacesService.findAll(query ?? {});
  }

  @Query(() => Workspace, { name: 'workspace' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.workspacesService.findOne(id);
  }

  @Mutation(() => Workspace)
  updateWorkspace(@Args('input') input: UpdateWorkspaceInput) {
    return this.workspacesService.update(input.id, input);
  }

  @Mutation(() => Workspace)
  removeWorkspace(@Args('id', { type: () => Int }) id: number) {
    return this.workspacesService.remove(id);
  }
}
