const { isLoggedIn, isNotLoggedIn } = require(".");

describe('isLoggedIn', () => {
    test('로그인되어 있으면 isLoggedIn이 next를 호출해야 함', () => {
        // 모킹
        const req = {
            // 로그인이 되어 있다는 가정이 필요하므로, 항상 true를 반환해야함.
            isAuthenticated: jest.fn(() => true),
        };
        const res = {
            // status함수 이후 send함수가 체이닝되어 있기때문에 다음과 같이 처리
            status: jest.fn(() => res),
            send: jest.fn(),
        };
        // 일반함수는 toBeCalledTimes에서 인식을 못함.
        // const next = function() => {};
        const next = jest.fn();
        isLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });
    
    test('로그인되어 있지 않으면 isLoggedIn이 에러를 응답해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => false),
        };
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
        const next = jest.fn();
        isLoggedIn(req, res, next);
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('로그인 필요');
    });
});


describe('isNotLoggedIn', () => {
    const res = {
        redirect: jest.fn(),
    };
    const next = jest.fn();

    test('로그인되어 있으면 isNotLoggedIn이 에러를 응답해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => true),
        };

        isNotLoggedIn(req, res, next);
        const message = encodeURIComponent('로그인한 상태입니다.');
        expect(res.redirect).toBeCalledWith(`/?error=${message}`);
    });
    
    test('로그인되어 있지 않으면 isNotLoggedIn이 next를 호출해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => false),
        };

        isNotLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });
});
