import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CreateNoteInput } from './dto/create-note.input';
import { UpdateNoteInput } from './dto/update-note.input';
import { Note } from './model/note.model';
import { NotesService } from './notes.service';

@Resolver(() => Note)
export class NotesResolver {
  constructor(private readonly noteService: NotesService) {}

  @Query(() => [Note], { name: 'notes' })
  findAll() {
    return this.noteService.findAll();
  }

  @Query(() => Note, { name: 'note' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.noteService.findOne(id);
  }

  @Mutation(() => Note)
  createNote(@Args('input') input: CreateNoteInput) {
    return this.noteService.create(input);
  }

  @Mutation(() => Note)
  updateNote(@Args('input') input: UpdateNoteInput) {
    return this.noteService.update(input);
  }

  @Mutation(() => Note)
  removeNote(@Args('id', { type: () => ID }) id: string) {
    return this.noteService.remove(id);
  }
}
