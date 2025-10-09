import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
} from "class-validator";

import { BusinessType } from "src/constants/business-types.enum";

export class CreateBusinessDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly contact: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly field: BusinessType;
}

export class UpdateBusinessDto {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly contact: string;

  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly field: BusinessType;

  @IsBoolean()
  @IsOptional()
  csvUploaded: boolean;
}

export class UploadFileDto {
  file: File;
}
