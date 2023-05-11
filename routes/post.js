const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { afterUploadImage, uploadPost } = require('../controller/post');

try {
    fs.readdirSync('uploads');
} catch (error) {
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            console.log(file);
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
})
// POST /post/img (이미지를 업로드 하기 위한 경로)
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

// 설정이 다르기 때문에 multer객체 추가
const upload2 = multer();
// POST /post/ 단순 게시글 올리기 위한 경로
router.post('/', isLoggedIn, upload2.none(), uploadPost);

module.exports = router;
