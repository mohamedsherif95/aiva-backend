import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsNumber,
  IsDate,
  MinLength,
} from 'class-validator';

export class CreatePayrollDto {
  @IsNotEmpty()
  @IsPositive()
  userId: number;

  @IsNotEmpty()
  @IsDate()
  payDay: Date;

  @IsNotEmpty()
  @IsPositive()
  netSalary: number;

  @IsOptional()
  @IsNumber()
  bonus: number;

  @IsOptional()
  @IsNumber()
  absentDays: number;

  @IsOptional()
  @IsNumber()
  salaryAdvance: number;

  @IsOptional()
  @IsString()
  notes: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;
}
