import { IsInt, IsOptional } from "class-validator";
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
} from "typeorm";

export class FindOneFilter<T> implements FindOneOptions<T> {
  @IsOptional()
  relations?: FindOptionsRelations<T>;
  @IsOptional()
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
}

export class FindManyFilter<T>
  extends FindOneFilter<T>
  implements FindManyOptions<T>
{
  @IsOptional()
  @IsInt()
  skip?: number;
  @IsOptional()
  @IsInt()
  take?: number;
}
