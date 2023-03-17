import { NumberField } from 'src/decorators/field.decorator';

export class DeletePostParamsDTO {
  @NumberField({ int: true })
  id: number;
}

export class DeletePostResponseDTO {}
