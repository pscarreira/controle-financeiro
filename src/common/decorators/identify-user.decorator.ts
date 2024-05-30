import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const IdentifyUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];

    const configService = new ConfigService();
    const jwtService = new JwtService({
      secret: configService.get('JWT_SECRET'),
    });

    const decodedToken = jwtService.decode(token) as any;

    return decodedToken.sub;
  },
);
