import { PartialType } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class CreateQuestionDto {

    @IsString()
    question: string;

    @IsString()
    answer: string;

    @IsArray()
    options: string[];
}
export class UpdateQuestionDto extends PartialType(CreateQuestionDto) { }

