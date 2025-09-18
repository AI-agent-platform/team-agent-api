import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { BusinessType } from 'src/constants/business-types.enum';

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