import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { envKeys } from '../../../config/envKeys';
import { User } from '../../users/entities/User.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private UserRepository: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envKeys.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const { iat, exp, ...payloadData } = payload;
    const userData = await this.UserRepository.findOne({
      where: { id: payloadData.id },
      select: ['id', 'name', 'email'],
    });
    if (!userData) return false;

    payloadData.id = userData.id;
    payloadData.name = userData.name;
    payloadData.email = userData.email;
    payloadData.iat = iat;
    payloadData.exp = exp;
    return payloadData;
  }
}
