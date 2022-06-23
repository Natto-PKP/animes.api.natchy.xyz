import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import { v4 as UUID } from 'uuid';

import { server } from '../../src/server';

const request = supertest(server);

const user = {
  data: {
    email: faker.internet.email(),
    pseudo: faker.internet.userName(),
    password: faker.internet.password(),
  },
  token: null as string | null,
  uuid: null as string | null,
};

describe('/register [POST]', () => {
  it('account created correctly', async () => {
    expect.hasAssertions();

    const { status } = await request.post('/users/register').type('form').send(user.data);

    expect(status).toBe(201);
  });

  it('data in body missing', async () => {
    expect.hasAssertions();

    const { body, status } = await request.post('/users/register').type('form').send({});

    expect(status).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.code).toBe(status);
  });

  it('incorrect email provided', async () => {
    expect.hasAssertions();

    const { body, status } = await request.post('/users/register').type('form').send({
      ...user.data,
      email: 'ferret is not a email',
    });

    expect(status).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.code).toBe(status);
  });

  it('email already taken', async () => {
    expect.hasAssertions();

    const { body, status } = await request.post('/users/register').type('form').send(user.data);

    expect(status).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.code).toBe(status);
  });
});

describe('/login [POST]', () => {
  it('connection successful', async () => {
    expect.hasAssertions();

    const { body, status } = await request.post('/users/login').type('form').send({
      email: user.data.email,
      password: user.data.password,
    });

    expect(status).toBe(200);
    expect(typeof body).toBe('object');
    expect(typeof body.uuid).toBe('string');
    expect(typeof body.token).toBe('string');

    user.uuid = body.uuid;
    user.token = `Bearer ${body.token}`;
  });

  it('data in body missing', async () => {
    expect.hasAssertions();

    const { body, status } = await request.post('/users/login').type('form').send({});

    expect(status).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.code).toBe(status);
  });

  it('connection refused', async () => {
    expect.hasAssertions();

    const { body, status } = await request.post('/users/login').type('form').send({});

    expect(status).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.code).toBe(status);
  });
});

describe('/ [GET]', () => {
  it('specific permission required', async () => {
    expect.hasAssertions();

    const { body, status } = await request.get('/users').set('Authorization', user.token as string);

    expect(status).toBe(403);
    expect(typeof body).toBe('object');
    expect(body.code).toBe(status);
  });
});

describe('/profile [GET]', () => {
  it('users profile get correctly', async () => {
    expect.hasAssertions();

    const { body, status } = await request.get('/users/profile');

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();

    body.forEach((profile: any) => {
      expect(typeof profile).toBe('object');
      expect(typeof profile.uuid).toBe('string');
      expect(profile.email).toBeUndefined();
      expect(typeof profile.pseudo).toBe('string');
      expect(profile.discriminator).toMatch(/^[0-9]{4}$/);
      expect(profile.tag).toMatch(new RegExp(`^${profile.pseudo}#[0-9]{4}$`));
      expect(profile.permissions).toBeUndefined();
      expect(profile.avatarFile).toBeNull();
    });
  });
});

describe('/:userUuid [GET]', () => {
  it('user get correctly', async () => {
    expect.hasAssertions();

    const { body, status } = await request.get(`/users/${user.uuid}`).set('Authorization', user.token as string);

    expect(status).toBe(200);
    expect(typeof body).toBe('object');
    expect(body.uuid).toBe(user.uuid);
    expect(body.email).toBe(user.data.email);
    expect(body.pseudo).toBe(user.data.pseudo);
    expect(body.discriminator).toMatch(/^[0-9]{4}$/);
    expect(body.tag).toMatch(new RegExp(`^${body.pseudo}#[0-9]{4}$`));
    expect(body.permissions).toBeNull();
    expect(body.avatarFile).toBeNull();
  });

  it('wrong uuid', async () => {
    expect.hasAssertions();

    const { body, status } = await request.get(`/users/${UUID()}`).set('Authorization', user.token as string);

    expect(status).toBe(403);
    expect(typeof body).toBe('object');
    expect(body.code).toBe(status);
  });
});

describe('/:userUuid/profile [GET]', () => {
  it('user profile get correctly', async () => {
    expect.hasAssertions();

    const { body, status } = await request.get(`/users/${user.uuid}/profile`);

    expect(status).toBe(200);
    expect(typeof body).toBe('object');
    expect(typeof body.uuid).toBe('string');
    expect(body.email).toBeUndefined();
    expect(typeof body.pseudo).toBe('string');
    expect(body.discriminator).toMatch(/^[0-9]{4}$/);
    expect(body.tag).toMatch(new RegExp(`^${body.pseudo}#[0-9]{4}$`));
    expect(body.permissions).toBeUndefined();
    expect(body.avatarFile).toBeNull();
  });
});

describe('/:userUuid [PATCH]', () => {
  it('user update correctly', async () => {
    expect.hasAssertions();

    const pseudo = faker.internet.userName();

    const { body, status } = await request.patch(`/users/${user.uuid}`).type('form').set('Authorization', user.token as string).send({
      pseudo,
    });

    expect(status).toBe(200);
    expect(typeof body).toBe('object');
    expect(body.uuid).toBe(user.uuid);
    expect(body.email).toBe(user.data.email);
    expect(body.pseudo).toBe(pseudo);
    expect(body.discriminator).toMatch(/^[0-9]{4}$/);
    expect(body.tag).toMatch(new RegExp(`^${pseudo}#[0-9]{4}$`));
    expect(body.permissions).toBeNull();
    expect(body.avatarFile).toBeNull();
  });

  it('data in body missing', async () => {
    expect.hasAssertions();

    const { body, status } = await request.patch(`/users/${user.uuid}`).type('form').set('Authorization', user.token as string).send({ });

    expect(status).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.code).toBe(status);
  });
});

describe('/:userUuid [DELETE]', () => {
  it('user delete correctly', async () => {
    expect.hasAssertions();

    const { status } = await request.delete(`/users/${user.uuid}`).set('Authorization', user.token as string);

    expect(status).toBe(204);
  });

  it('user no longer exist', async () => {
    expect.hasAssertions();

    const { body, status } = await request.delete(`/users/${user.uuid}`).set('Authorization', user.token as string);

    expect(status).toBe(404);
    expect(typeof body).toBe('object');
    expect(body.code).toBe(status);
  });

  it('no token provided', async () => {
    expect.hasAssertions();

    const { body, status } = await request.delete(`/users/${user.uuid}`);

    expect(status).toBe(401);
    expect(typeof body).toBe('object');
    expect(body.code).toBe(status);
  });
});
