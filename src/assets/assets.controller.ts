import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import * as AdmZip from 'adm-zip';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';

@Controller('assets')
@ApiTags('Assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService.create(createAssetDto);
  }

  @Get('fonts')
  listFonts() {
    return this.assetsService.listFonts();
  }

  @Post('fonts')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFonts(@Body() body: { fontName: string }, @UploadedFile() file) {
    let { fontName } = body;

    if (!file) {
      throw new Error('No file uploaded');
    }

    if (!fontName) {
      const uploadedFileName = file.originalname; // Get the original name of the uploaded file
      const matches = uploadedFileName.match(/([a-zA-Z]+)/); // Extract the font name using regular expression

      if (!matches || matches.length < 1) {
        throw new Error(
          'Font name could not be extracted from the uploaded file name',
        );
      }

      fontName = matches[0]; // Extracted font name
    }
    fontName = fontName.toLowerCase();

    const zip = new AdmZip(file.buffer);
    const zipEntries = zip.getEntries();
    let ttfFiles = 0;

    // Check if the zip file contains exactly 4 TTF files
    zipEntries.forEach((entry) => {
      if (entry.entryName.toLowerCase().endsWith('.ttf')) {
        ttfFiles++;
      }
    });

    if (ttfFiles === 1) {
      let singleTtfFileName = '';
      // Rename the single TTF file to match the expected format
      zipEntries.forEach((entry) => {
        if (entry.entryName.toLowerCase().endsWith('.ttf')) {
          singleTtfFileName = entry.entryName;
          const renamedFileName = `${fontName}-regular.ttf`;
          entry.entryName = renamedFileName;
        }
      });
    } else {
      throw new Error(
        'The zip file must contain exactly 4 TTF files (normal, italic, bold, bolditalic)',
      );
    }

    // Remove the existing font directory if it exists
    const fontDir = path.join('.', '.data', 'fonts', fontName);
    if (fs.existsSync(fontDir)) {
      rimraf.sync(fontDir);
    }

    // Create a new directory to extract the font files
    fs.mkdirSync(fontDir, { recursive: true });

    // Extract and save font files
    zipEntries.forEach((entry) => {
      const fileName = path.basename(entry.entryName).toLowerCase();
      if (fileName.endsWith('.ttf')) {
        const destPath = path.join(fontDir, fileName);
        fs.writeFileSync(destPath, entry.getData());
      }
    });

    return { message: 'Fonts uploaded and saved successfully' };
  }

  @Get('images')
  listImages() {
    return this.assetsService.listImages();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetsService.remove(+id);
  }
}
