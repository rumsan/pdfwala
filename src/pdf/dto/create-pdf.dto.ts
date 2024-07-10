import {
  IsNotEmpty,
  IsString,
  IsOptional,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DonorCardDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  dob: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  bloodGroup: string;

  @IsNotEmpty()
  @IsString()
  organization: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  eventName: string;

  @IsNotEmpty()
  @IsString()
  eventDate: string;
}

export class CertificateDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  eventLocation: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  organizerName?: string;

  @IsNotEmpty()
  @IsString()
  eventDate: string;
}

export class ConsentDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  dob: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  orgName: string;

  @IsOptional()
  @IsString()
  lastDonated?: string;
}

export class CreatePdfDto {
  @IsNotEmpty()
  @IsString()
  templateName: string;

  @ValidateNested()
  @Type((object) => {
    if (object.object.templateName === 'donor-card') {
      return DonorCardDto;
    } else if (object.object.templateName === 'hlb-certificate') {
      return CertificateDto;
    } else if (object.object.templateName === 'consent') {
      return ConsentDto;
    } else {
      return Object;
    }
  })
  data: DonorCardDto | CertificateDto | ConsentDto;
}
