import { PartialType } from '@nestjs/mapped-types';
import { CreateMagicEdenDto } from './create-magic-eden.dto';

export class UpdateMagicEdenDto extends PartialType(CreateMagicEdenDto) {}
