import { IsJSON, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { json } from 'stream/consumers';

export class CreatePdfDto {
    @IsNotEmpty()
    @IsString()
    templateName: string;
//     @IsNotEmpty()
//     @IsJSON()
//     data:{

//   fullName:string
//   email:string
//     }
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
