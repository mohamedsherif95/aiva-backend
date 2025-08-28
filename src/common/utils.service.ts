import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
    parseJson(str: string) {
        return JSON.parse(str.replaceAll("```", "").replaceAll("json", ""));
    }
}
