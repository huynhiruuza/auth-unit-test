import {
  Controller,
  Query,
  Get as MethodGet,
  Param,
  Body,
  Post as MethodPost,
  Put as MethodPut,
  Delete as MethodDelete,
} from '@nestjs/common';
import { PostService } from './posts.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  FilterPostResponseDTO,
  FilterPostRequestDTO,
  FilterPostRequest,
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
import { Auth } from 'decorators/auth.decorator';
import { ApiNestedQuery } from 'decorators/api-nested-query.decorator';

@Controller()
@ApiTags('Post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @MethodGet('/api/posts')
  @Auth()
  @ApiBearerAuth('BearerAuth')
  @ApiNestedQuery('posts', FilterPostRequest)
  filter(
    @Query() queries: FilterPostRequestDTO,
  ): Promise<FilterPostResponseDTO> {
    return this.postService.filter(queries);
  }

  @MethodGet('/api/posts/:id')
  show(@Param() params: ShowPostParamsDTO): Promise<ShowPostResponseDTO> {
    return this.postService.show(params);
  }

  @MethodPost('/api/posts')
  create(
    @Body() request: CreatePostRequestDTO,
  ): Promise<CreatePostResponseDTO> {
    return this.postService.create(request);
  }

  @MethodPut('/api/posts/:id')
  update(
    @Param() params: UpdatePostParamsDTO,
    @Body() request: UpdatePostRequestDTO,
  ): Promise<UpdatePostResponseDTO> {
    return this.postService.update(params, request);
  }

  @MethodDelete('/api/posts/:id')
  delete(@Param() params: DeletePostParamsDTO): Promise<DeletePostResponseDTO> {
    return this.postService.delete(params);
  }
}
