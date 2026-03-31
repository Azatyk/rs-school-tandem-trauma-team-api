import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type AuthenticatedRequestUser = {
  userId: string;
  email: string;
};

export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedRequestUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: AuthenticatedRequestUser }>();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
