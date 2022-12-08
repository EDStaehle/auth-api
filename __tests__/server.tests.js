const {server} = require('../src/server');
const supertest = require('supertest');
const {db, users, food, clothes} = require('../src/auth/models/index');


const request = supertest(server);
let userData = {
  testUser: { username: 'user', password: 'password' },
};
let accessToken = null;

beforeAll(async () => {
  await db.sync();
  testUser = await users.create({
    username: 'jhon cena',
    password: 'cantseeme',
    role: 'admin',
  });
});
afterAll(async () => {
  await db.drop()
})
describe('auth and api works as expected', () => {
  it('allows user to signup', async () => {
    const response = await request.post('/signup').send(userData.testUser);
    const userObject = response.body;

    expect(response.status).toBe(201);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(userData.testUser.username);
  });
  it('can signin', async () =>{
    let { username, password } = userData.testUser;
    let response = await request.post('/signin').auth(username, password);
    let userObject = response.body;
    expect(response.status).toBe(200);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(username);
  });
  it('users with create access can post', async () => {
    let response = await request.post('/api/v2/food').set('Authorization', `Bearer ${testUser.token}`).send({
      name: 'test',
      calories: 1000,
      type:'fruit'
    });
    expect(response.status).toBe(201);
    expect(response.body.name).toEqual('test')
    expect(response.body.calories).toEqual(1000)
    expect(response.body.type).toEqual('fruit')
  });
  it('users with create access can edit', async () => {
    let response = await request.put('/api/v2/food/1').set('Authorization', `Bearer ${testUser.token}`).send({
      name: 'tests',
      calories: 1000,
      type:'fruit'
    });
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual('tests')
    expect(response.body.calories).toEqual(1000)
    expect(response.body.type).toEqual('fruit')
  });
  it('users with create access can read', async () => {
    let response = await request.get('/api/v2/food').set('Authorization', `Bearer ${testUser.token}`);
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body[0].name).toEqual('tests')
    expect(response.body[0].calories).toEqual(1000)
    expect(response.body[0].type).toEqual('fruit')
  });
  it('users with create access can delete', async () => {
    let response = await request.delete('/api/v2/food/1').set('Authorization', `Bearer ${testUser.token}`);
    expect(response.status).toBe(200);

  });
  it('users with create access can post', async () => {
    let response = await request.post('/api/v2/clothes').set('Authorization', `Bearer ${testUser.token}`).send({
      name: 'test',
      color: 'red',
      size:'lg'
    });
    expect(response.status).toBe(201);
    expect(response.body.name).toEqual('test')
    expect(response.body.color).toEqual('red')
    expect(response.body.size).toEqual('lg')
  });
  it('users with create access can edit', async () => {
    let response = await request.put('/api/v2/clothes/1').set('Authorization', `Bearer ${testUser.token}`).send({
      name: 'tests',
      calories: 1000,
      type:'fruit'
    });
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual('tests')
    expect(response.body.color).toEqual('red')
    expect(response.body.size).toEqual('lg')
  });
  it('users with create access can read', async () => {
    let response = await request.get('/api/v2/clothes').set('Authorization', `Bearer ${testUser.token}`);
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body[0].name).toEqual('tests')
    expect(response.body[0].color).toEqual('red')
    expect(response.body[0].size).toEqual('lg')
  });
  it('users with create access can delete', async () => {
    let response = await request.delete('/api/v2/clothes/1').set('Authorization', `Bearer ${testUser.token}`);
    expect(response.status).toBe(200);

  });
})