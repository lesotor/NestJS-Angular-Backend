import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET } from 'src/config/constants';
import { PayloadInteface } from '../payload.interface';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
      @InjectRepository(UserEntity)
      private readonly authRepository: AuthRepository,
      private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(JWT_SECRET)
    });
  }

  async validate(payload: PayloadInteface) {
    const {userName, email} = payload;
    const user = await this.authRepository.findOne({where: [{userName: userName}, {email: email}]});
    if(!user) return new UnauthorizedException(new MessageDto('wrong credentials'));
    return payload;
  }
}