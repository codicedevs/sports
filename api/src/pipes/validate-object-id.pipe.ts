import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform {
  constructor(private readonly fieldName?: string ) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (!Types.ObjectId.isValid(value)) {
      const errorMessage = (value && this.fieldName)
        ? `ID de ${this.fieldName} inválido`
        : 'ID inválido';
      throw new BadRequestException(errorMessage);
    }
    return value;
  }
}
