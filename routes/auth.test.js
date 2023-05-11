const app = require("../app");
const request = require('supertest');
const { sequelize } = require("../models");

// 모든 테스트가 시작되기 전 한 번만 호출
beforeAll(async () => {
    // DB가 연결되어 있는지를 확인하기 위함.
    await sequelize.sync({ force: true });
});

// 해당 테스트가 시작되기 전 작업
beforeEach(() => {});

describe('POST /join', () => {
    test('로그인 안 했으면 가입', (done) => {
        request(app).post('/auth/join')
            .send({
                email: 'choco@naver.com',
                nick: 'choco',
                password: '1q2w3e4r!@',
            })
            .expect('location', '/')
            .expect(302, done);
    });
    test('회원가입 이미 했는데 또 하는 경우', (done) => {
        request(app).post('/auth/join')
            .send({
                email: 'choco@naver.com',
                nick: 'choco',
                password: '1q2w3e4r!@',
            })
            .expect('location', '/join?error=exist')
            .expect(302, done);
    });
});

describe('POST /join', () => {
    const agent = request.agent(app);
    beforeEach((done) => {
        agent
            .post('/auth/login')
            .send({
                email: 'choco@naver.com',
                password: '1q2w3e4r!@',
            })
            .end(done);
    });
    test('로그인 했으면 회원가입 진행이 안 되어야 함.', (done) => {
        const message = encodeURIComponent('로그인한 상태입니다.');
        agent
            .post('/auth/join')
            .send({
                email: 'choco@naver.com',
                nick: 'choco',
                password: '1q2w3e4r!@',
            })
            .expect('location', `/?error=${message}`)
            .expect(302, done);
    });
});

describe('POST /login', () => {
    test('로그인 수행', (done) => {
        request(app).post('/auth/login')
            .send({
                email: 'choco@naver.com',
                password: '1q2w3e4r!@',
            })
            .expect('location', '/')
            .expect(302, done);
    });
});

// 해당 테스트가 끝난 후 작업
afterEach(() => {});

// 모든 테스트가 끝나고 난 후
afterAll(async () => {

});