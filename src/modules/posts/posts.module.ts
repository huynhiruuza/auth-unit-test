import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { provideCustomRepository } from 'src/utils/repository';
import { PostService } from './posts.service';
import { PostController } from './posts.controller';
import { PostRepository } from './posts.repository';
import { Post } from 'entities/posts';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [provideCustomRepository(Post, PostRepository), PostService],
  controllers: [PostController],
})
export class PostModule {}
