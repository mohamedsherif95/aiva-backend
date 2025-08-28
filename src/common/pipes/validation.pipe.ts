import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';

type TranslationMap = Record<string, any>;

const defaultOptions: ValidatorOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  validationError: { target: false },
  enableDebugMessages: true,
};

export interface I18nValidationError {
  property: string;
  constraints: {
    [type: string]: string;
  };
}

@Injectable()
export class I18nValidationPipe implements PipeTransform<any> {
  constructor(private readonly i18n: I18nService<TranslationMap>) {}

  async transform(value: any, { metatype, type }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value, {
      enableImplicitConversion: true,
      enableCircularCheck: true,
    });

    const errors = await validate(object, defaultOptions);

    if (errors.length > 0) {
      const formattedErrors = await this.formatErrors(errors);
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    return object;
  }

  private async formatErrors(errors: ValidationError[], parentPath = ''): Promise<any[]> {
    const formattedErrors = [];

    for (const error of errors) {
      const path = parentPath ? `${parentPath}.${error.property}` : error.property;

      if (error.children && error.children.length > 0) {
        // Handle nested validation errors
        const nestedErrors = await this.formatErrors(error.children, path);
        formattedErrors.push(...nestedErrors);
      }

      if (error.constraints) {
        const constraints = await this.formatConstraints(error);
        if (Object.keys(constraints).length > 0) {
          formattedErrors.push({
            property: path,
            constraints,
            value: error.value,
          });
        }
      }
    }

    return formattedErrors;
  }

  private async formatConstraints(error: ValidationError): Promise<{ [key: string]: string }> {
    const constraints = {};
    
    for (const [key, value] of Object.entries(error.constraints || {})) {
      console.log("🚀 ~ I18nValidationPipe ~ formatConstraints ~ error:", error)
      console.log("🚀 ~ I18nValidationPipe ~ formatConstraints ~ error:", {
        property: error.property,
        value: error.value,
        constraints: Object.values(error.constraints),
        target: error.target?.constructor?.name || 'object',
      })
      constraints[key] = this.i18n.t(`validation.${key}`, {
        args: {
          property: error.property,
          value: error.value,
          constraints: Object.values(error.constraints),
          target: error.target?.constructor?.name || 'object',
        },
        defaultValue: value,
      });
    }
    
    return constraints;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
