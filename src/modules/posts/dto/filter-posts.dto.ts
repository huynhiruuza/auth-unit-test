import { Post } from 'entities/posts';
import {
  StringFieldOptional,
  NumberFieldOptional,
  ObjectFieldOptional,
} from 'src/decorators/field.decorator';

export class FilterPostRequest {
  @StringFieldOptional({ maxLength: 255, minLength: 0 })
  title?: string;
}
export class FilterPostRequestDTO {
  @NumberFieldOptional({ int: true })
  pagination_page?: number;
  @NumberFieldOptional({ int: true })
  pagination_limit?: number;
  @ObjectFieldOptional(FilterPostRequest)
  posts?: FilterPostRequest;
}
export class FilterPostResponse {
  id: number;
  created_at: Date;
  updated_at: Date;
  title: string;
}

export class FilterPostResponseDTO {
  posts: FilterPostResponse[];
  total_pages?: number;
  total_count: number;

  constructor(posts: Post[], total_count: number, total_pages?: number) {
    this.posts = posts.map((post) => ({
      ...post,
      id: post?.id,
      created_at: post?.created_at,
      updated_at: post?.updated_at,
      title: post?.title,
    }));
    this.total_pages = total_pages;
    this.total_count = total_count;
  }
}
