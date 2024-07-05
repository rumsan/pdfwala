import { Injectable } from '@nestjs/common';
import { listFontsFromFolder } from 'src/utils';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetsService {
  create(createAssetDto: CreateAssetDto) {
    return 'This action adds a new asset';
  }

  listFonts() {
    return listFontsFromFolder(`${process.env.DATA_PATH}/fonts`);
  }

  listImages() {}

  findOne(id: number) {
    return `This action returns a #${id} asset`;
  }

  update(id: number, updateAssetDto: UpdateAssetDto) {
    return `This action updates a #${id} asset`;
  }

  remove(id: number) {
    return `This action removes a #${id} asset`;
  }
}
