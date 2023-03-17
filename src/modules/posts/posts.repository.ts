import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/shared/base.repository';
import { Post } from 'entities/posts';

@Injectable()
export class PostRepository extends BaseRepository<Post> {}
