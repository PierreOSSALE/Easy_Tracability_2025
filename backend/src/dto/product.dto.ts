// EASY-TRACABILITY: backend/src/dto/product.dto.ts
import {
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
  Min,
  MaxLength,
  IsUrl,
} from "class-validator";

export class CreateProductDto {
  @IsOptional()
  @IsUUID()
  uuid?: string;

  @IsString()
  @MaxLength(255)
  name!: string;

  @IsString()
  @MaxLength(255)
  barcode!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(0)
  stockQuantity!: number;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string; // 🆕
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  barcode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string; // 🆕
}
