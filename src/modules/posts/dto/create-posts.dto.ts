import { Post } from 'entities/posts';
import {
  StringFieldOptional,
  ObjectField,
} from 'src/decorators/field.decorator';

export class CreatePostRequest {
  @StringFieldOptional({ maxLength: 255, minLength: 0 })
  title?: string;
}
export class CreatePostRequestDTO {
  @ObjectField(CreatePostRequest)
  posts: CreatePostRequest;
}
export class CreatePostResponse {
  id: number;
  created_at: Date;
  updated_at: Date;
  title: string;
}
export class CreateErrorObjectResponse {}

export class CreatePostResponseDTO {
  post: CreatePostResponse;
  error_object: Object;

  constructor(post: Post, error_object?: Object) {
    this.post = {
      ...post,
      id: post?.id,
      created_at: post?.created_at,
      updated_at: post?.updated_at,
      title: post?.title,
    };
    this.error_object = error_object;
  }
}
