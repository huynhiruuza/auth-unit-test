import { Post } from 'entities/posts';
import { NumberField } from 'src/decorators/field.decorator';

export class ShowPostParamsDTO {
  @NumberField({ int: true })
  id: number;
}
export class ShowPostResponse {
  id: number;
  created_at: Date;
  updated_at: Date;
  title: string;
}

export class ShowPostResponseDTO {
  post: ShowPostResponse;

  constructor(post: Post) {
    this.post = {
      ...post,
      id: post?.id,
      created_at: post?.created_at,
      updated_at: post?.updated_at,
      title: post?.title,
    };
  }
}
