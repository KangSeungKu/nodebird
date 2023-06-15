import { RequestHandler } from "express";
import Hashtag from "../models/hashtag";
import Post from "../models/post";
import User from "../models/user";

const renderProfile: RequestHandler = (req, res, next) => {
    res.render('profile', { title: '내 정보 - NodeBird' });
};

const renderJoin: RequestHandler = (req, res, next) => {
    res.render('join', { title: '회원 가입 - NodeBird' });
};

const renderMain: RequestHandler = async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createdAt', 'DESC']]
        });
        res.render('main', { 
            title: 'NodeBird',
            twits: posts, 
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const renderHashtag: RequestHandler = async (req, res, next) => {
    const query = req.query.hashtag as string;
    if(!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query } });
        let posts: Post[] = [];
        if(hashtag) {
            posts = await hashtag.getPosts({
                include: [{ model: User, attributes: ['id', 'nick'] }],
                order: [['createdAt', 'DESC']],
            });
        }
        res.render('main', {
            title: `${query} | NodeBird`,
            twits: posts,
        });
    } catch (error) {
        
    }

}

export { renderHashtag, renderJoin, renderMain, renderProfile };