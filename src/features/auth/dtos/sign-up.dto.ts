import { StringField } from 'decorators/field.decorator';

export class SignUpDto {
  @StringField({ email: true, maxLength: 255, minLength: 0 })
  email: string;

  @StringField({ maxLength: 255, minLength: 0, password: true })
  password: string;
}
