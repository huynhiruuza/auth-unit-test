import { ConfigService } from '@nestjs/config';
import { getRepository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import * as bcrypt from 'bcryptjs';
import { advanceBy } from 'jest-date-mock';

import { userFactory } from './factories';
import { setupBeforeAndAfter } from './setupBeforeAndAfter';

setupBeforeAndAfter();

describe('Auth Controller', () => {
  let httpServer: request.SuperTest<request.Test>;
  let app: INestApplication;
  let token;
  let user;
  let config: ConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    config = moduleFixture.get<ConfigService>(ConfigService);

    app = moduleFixture.createNestApplication();
    await app.init();

    httpServer = request(app.getHttpServer());
  });

  beforeEach(async () => {
    user = {
      ...userFactory(),
      email: 'user@example.com',
      password: 'Letmein123@',
    };
    const params = {
      email: user.email,
      password: user.password,
      grant_type: 'password',
      scope: 'users',
    };
    const encrypted_password = bcrypt.hashSync(params.password, 10);
    await getRepository('users').insert({
      ...user,
      encrypted_password: encrypted_password,
    });

    token = await httpServer
      .post('/oauth/token')
      .send(params)
      .then((res) => res.body);
  });

  describe('register', () => {
    it('register success', async () => {
      await httpServer
        .post('/api/users_registrations')
        .send({ ...userFactory(), email: 'registration@example.com' })
        .expect(200);
    });

    it('register failure because duplicate email', async () => {
      const user = userFactory();
      const params = { ...user, email: 'test@example.com' };
      await getRepository('users').insert({ ...params });
      await httpServer
        .post('/api/users_registrations')
        .send(params)
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toEqual('app.users.already_exists');
        });
    });
  });

  describe('login', () => {
    describe('success', () => {
      it('login success', async () => {
        const user = {
          ...userFactory(),
          email: 'login@example.com',
          password: 'Letmein123@',
        };
        const params = {
          email: user.email,
          password: user.password,
          grant_type: 'password',
          scope: 'users',
        };
        const encrypted_password = bcrypt.hashSync(params.password, 10);
        await getRepository('users').insert({
          ...user,
          encrypted_password: encrypted_password,
        });

        await httpServer
          .post('/oauth/token')
          .send(params)
          .expect(200)
          .expect(({ body }) => {
            expect(body.access_token).toBeDefined();
            expect(body.refresh_token).toBeDefined();
          });
      });
    });
    describe('failure', () => {
      it('invalid credentials', async () => {
        await httpServer
          .post('/oauth/token')
          .send({
            email: 'fake@example.com',
            password: 'Letmein123@',
            scope: 'users',
            grant_type: 'password',
          })
          .expect(403)
          .expect(({ body }) => {
            expect(body.message).toEqual('app.users.wrong_credentials');
          });
      });
      //it('email inactive', async () => {
      //const user = {
      //...userFactory(),
      //email: 'login@example.com',
      //password: 'Letmein123@',
      //};
      //const params = {
      //email: user.email,
      //password: user.password,
      //grant_type: 'password',
      //scope: 'users',
      //};
      //const encrypted_password = bcrypt.hashSync(params.password, 10);
      //await getRepository('users').insert({
      //...user,
      //encrypted_password: encrypted_password,
      //confirmed_at: null,
      //});

      //await httpServer
      //.post('/oauth/token')
      //.send(params)
      //.expect(403)
      //.expect(({ body }) => {
      //expect(body.access_token).toBeDefined();
      //expect(body.refresh_token).toBeDefined();
      //});
      //});
      it('locked', async () => {
        const user = {
          ...userFactory(),
          email: 'login@example.com',
          password: 'Letmein123@',
        };
        const params = {
          email: user.email,
          password: user.password,
          grant_type: 'password',
          scope: 'users',
        };
        const encrypted_password = bcrypt.hashSync(params.password, 10);
        await getRepository('users').insert({
          ...user,
          encrypted_password: encrypted_password,
          failed_attempts: 9,
        });

        // 10th attempt
        await httpServer
          .post('/oauth/token')
          .send({ ...params, password: 'wrong_password' })
          .expect(403)
          .expect(({ body }) => {
            expect(body.message).toEqual('app.users.wrong_credentials');
          });

        await httpServer
          .post('/oauth/token')
          .send({ ...params, password: 'wrong_password' })
          .expect(403)
          .expect(({ body }) => {
            expect(body.message).toEqual('app.users.locked');
          });
      });
    });
  });

  describe('refresh token', () => {
    describe('success', () => {
      it('refresh token success', async () => {
        const refreshTokenParams = {
          grant_type: 'refresh_token',
          refresh_token: token.refresh_token,
          scope: 'users',
        };
        await httpServer
          .post('/oauth/token')
          .send(refreshTokenParams)
          .expect(200)
          .expect(({ body }) => {
            expect(body.access_token).toBeDefined();
            expect(body.refresh_token).toBeDefined();
          });
      });
    });
    describe('failure', () => {
      it('refresh token expired', async () => {
        const refreshTokenParams = {
          grant_type: 'refresh_token',
          refresh_token: token.refresh_token,
          scope: 'users',
        };
        advanceBy(token.refresh_token_expires_in);
        await httpServer
          .post('/oauth/token')
          .send(refreshTokenParams)
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toEqual('app.refresh_token.invalid');
          });
      });
    });
  });

  describe('revoke token', () => {
    describe('success', () => {
      it('revoke access token success', async () => {
        const revokeTokenParams = {
          token: token.access_token,
        };
        await httpServer
          .post('/oauth/revoke')
          .send(revokeTokenParams)
          .expect(200);
      });
      it('revoke refresh token success', async () => {
        const revokeTokenParams = {
          token: token.refresh_token,
          token_type_hint: 'refresh_token',
        };
        await httpServer
          .post('/oauth/revoke')
          .send(revokeTokenParams)
          .expect(200);
      });
    });
  });

  describe('request send reset password', () => {
    describe('success', () => {
      it('response success with valid email', async () => {
        const resetPasswordParams = {
          email: user.email,
        };
        await httpServer
          .post('/api/users_reset_password_requests')
          .send(resetPasswordParams)
          .expect(200);
      });
      it('response success with invalid email', async () => {
        const resetPasswordParams = {
          email: 'invalid_email@example.com',
        };
        await httpServer
          .post('/api/users_reset_password_requests')
          .send(resetPasswordParams)
          .expect(200);
      });
    });
  });

  describe('verify reset password token', () => {
    describe('success', () => {
      it('verify success', async () => {
        const resetToken = 'SampleToken!@#';
        await getRepository('users').save({
          id: token.resource_id,
          reset_password_sent_at: new Date(),
          reset_password_token: resetToken,
        });
        const params = {
          reset_token: resetToken,
          password: 'Letmein1234@',
          password_confirmation: 'Letmein1234@',
        };
        await httpServer
          .post('/api/users_verify_reset_password_requests')
          .send(params)
          .expect(200);
      });
    });
    describe('failure', () => {
      it('wrong token', async () => {
        const resetToken = 'SampleToken!@#';
        await getRepository('users').save({
          id: token.resource_id,
          reset_password_sent_at: new Date(),
          reset_password_token: resetToken,
        });
        const params = {
          reset_token: 'wrongToken123@',
          password: 'Letmein1234@',
          password_confirmation: 'Letmein1234@',
        };
        await httpServer
          .post('/api/users_verify_reset_password_requests')
          .send(params)
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toEqual('app.reset_token.invalid');
          });
      });
      it('expired token', async () => {
        const resetToken = 'SampleToken!@#';
        await getRepository('users').save({
          id: token.resource_id,
          reset_password_sent_at: new Date(),
          reset_password_token: resetToken,
        });
        const params = {
          reset_token: resetToken,
          password: 'Letmein1234@',
          password_confirmation: 'Letmein1234@',
        };
        advanceBy(
          config.get('authentication.resetPasswordIn') * 3600 * 1000 + 3000,
        );
        await httpServer
          .post('/api/users_verify_reset_password_requests')
          .send(params)
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toEqual('app.reset_token.expired');
          });
      });
    });
  });
});
