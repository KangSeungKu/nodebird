import bcrypt from 'bcrypt';
import passport from "passport";
import User from "../models/user";
import { RequestHandler } from 'express';

const join: RequestHandler = async (req, res, next) => {
    const { nick, email, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if(exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch(error) {
        console.error(error);
        next(error);
    }
};
// POST /auth/login
const login: RequestHandler = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        // 해당 콜백함수는 index.js의 done(서버실패, 성공유저, 로직실패) 함수를 가리킴
        if(authError) { // 서버실패
            console.error(authError);
            return next(authError);
        }
        if(!user) { // 로직실패
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => { // 로그인 성공
            // 로그인 처리 중 에러가 발생할 수 있음. (빈도수는 매우낮음)
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
};

const logout: RequestHandler = (req, res, next) => {
    // 세션에 들어있던 세션쿠키와 유저ID의 연결을 끊는 것 (세션의 데이터 삭제)
    req.logout(() => {
        res.redirect('/');
    });
};

export { join, login, logout};