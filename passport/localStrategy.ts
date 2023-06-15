import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from 'bcrypt';

import User from "../models/user";

export default () => {
  passport.use(new LocalStrategy({
    usernameField: 'email', // req.body.email
    passwordField: 'password',  // req.body.password
  }, async (email, password, done) => { 
    // 로그인을 시킬 것인지에 대한 여부 
    try {
        // 해당 이메일이 존재하는지 확인
        const exUser = await User.findOne({ where: { email } });
        if(exUser) {
            // 입력받은 패스워드와 저장된 패스워드를 복호화하여 비교
            const result = await bcrypt.compare(password, exUser.password);
            if(result) {
                // done(서버실패, 성공유저, 로직실패);
                done(null, exUser);
            } else {
                // 서버에는 문제가 없는데 로그인을 시키면 안되는 경우
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        } else {
          done(null, false, { message: '가입되지 않은 회원입니다.' });
        }
    } catch (error) {
        console.error(error);
        // 서버실패 (예상치 못한 결과로 서버가 죽을 것 같을 때)
        done(error);
    }
  }));
};