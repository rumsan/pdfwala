import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { PdfService } from './pdf.service';
import { UpdatePdfDto } from './dto/update-pdf.dto';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { Response } from 'express';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post()
  async create(
    @Body() createPdfDto: CreatePdfDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.pdfService.create(createPdfDto);
    if (typeof result === 'string') {
      const userAgent = req.headers['user-agent']?.toLowerCase();
      if (userAgent && userAgent.includes('postman')) {
        // For Postman requests, send the PDF as a download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=consent.pdf',
        );
        res.send(Buffer.from(result, 'base64'));
      } else {
        // For other clients (browser, mobile apps), send the PDF as base64
        res.send({ result });
      }
    }
    return result;
  }

  @Get()
  findAll() {
    return this.pdfService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pdfService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePdfDto: UpdatePdfDto) {
    return this.pdfService.update(+id, updatePdfDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pdfService.remove(+id);
  }
}
