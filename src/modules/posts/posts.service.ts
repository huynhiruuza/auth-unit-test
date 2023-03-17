import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FilterPostResponseDTO,
  FilterPostRequestDTO,
  ShowPostResponseDTO,
  ShowPostParamsDTO,
  CreatePostResponseDTO,
  CreatePostRequestDTO,
  UpdatePostResponseDTO,
  UpdatePostParamsDTO,
  UpdatePostRequestDTO,
  DeletePostResponseDTO,
  DeletePostParamsDTO,
} from './dto';
import {
  QueryCondition,
  QueryOperators,
  QueryWhereType,
  QueryPagination,
  QueryOrder,
  QueryOrderDir,
} from 'src/shared/base.repository';
import { Post } from 'entities/posts';
import { PostRepository } from './posts.repository';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    readonly repository: PostRepository,
  ) {}

  async filter(queries: FilterPostRequestDTO) {
    const conditions: QueryCondition[] = [
      {
        column: 'title',
        value: queries?.posts?.title,
        operator: QueryOperators.START_WITH,
        whereType: QueryWhereType.WHERE,
      },
    ];

    const pagination: QueryPagination = {
      page: queries?.pagination_page,
      limit: queries?.pagination_limit,
    };

    const orders: QueryOrder[] = [
      { orderBy: 'posts.created_at', orderDir: QueryOrderDir.DESC },
    ];

    const [posts, totalCount, totalPages] = await this.repository.findMany({
      conditions,
      pagination,
      orders,
    });

    return new FilterPostResponseDTO(posts, totalCount, totalPages);
  }
  async show(params: ShowPostParamsDTO) {
    const conditions: QueryCondition[] = [
      {
        column: 'posts.id',
        value: params.id,
        operator: QueryOperators.EQUAL,
        whereType: QueryWhereType.WHERE,
      },
    ];

    const show = await this.repository.getOne({ conditions });

    return new ShowPostResponseDTO(show);
  }
  async create(request: CreatePostRequestDTO) {
    const data = {
      title: request?.posts?.title,
    };

    const create = await this.repository.createOne({ data });

    return new CreatePostResponseDTO(create);
  }
  async update(params: UpdatePostParamsDTO, request: UpdatePostRequestDTO) {
    const conditions: QueryCondition[] = [
      {
        column: 'posts.id',
        value: params.id,
        operator: QueryOperators.EQUAL,
        whereType: QueryWhereType.WHERE_AND,
      },
    ];

    const data = {
      title: request?.posts?.title,
    };

    const update = await this.repository.updateOne({ conditions, data });

    return new UpdatePostResponseDTO(update);
  }
  async delete(params: DeletePostParamsDTO) {
    const conditions: QueryCondition[] = [
      {
        column: 'posts.id',
        value: params.id,
        operator: QueryOperators.EQUAL,
        whereType: QueryWhereType.WHERE,
      },
    ];

    await this.repository.removeOne({ conditions });

    return new DeletePostResponseDTO();
  }
}
