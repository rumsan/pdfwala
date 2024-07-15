import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePdfDto {
  @IsNotEmpty()
  @IsString()
  templateName: string;

  @IsNotEmpty()
  data: any;
}
