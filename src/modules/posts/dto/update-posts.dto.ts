import { Post } from 'entities/posts';
import {
  NumberField,
  StringFieldOptional,
  ObjectFieldOptional,
} from 'src/decorators/field.decorator';

export class UpdatePostParamsDTO {
  @NumberField({ int: true })
  id: number;
}
export class UpdatePostRequest {
  @StringFieldOptional({ maxLength: 255, minLength: 0 })
  title?: string;
}
export class UpdatePostRequestDTO {
  @ObjectFieldOptional(UpdatePostRequest)
  posts?: UpdatePostRequest;
}
export class UpdatePostResponse {
  id: number;
  created_at: Date;
  updated_at: Date;
  title: string;
}
export class UpdateErrorObjectResponse {}

export class UpdatePostResponseDTO {
  post: UpdatePostResponse;
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
