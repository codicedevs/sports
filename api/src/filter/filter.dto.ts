import { IsInt, IsOptional, IsObject } from "class-validator";

export class FindOneFilter<T> {
  @IsOptional()
  @IsObject()
  relations?: Record<string, boolean>;

  @IsOptional()
  @IsObject()
  where?: Record<string, any> | Record<string, any>[];
}

export class FindManyFilter<T> extends FindOneFilter<T> {
  @IsOptional()
  @IsInt()
  skip?: number;

  @IsOptional()
  @IsInt()
  take?: number;
}
