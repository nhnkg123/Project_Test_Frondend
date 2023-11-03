let express = require('express');
let router = express.Router();
const postController = require('../controllers/postController');

router.get('/', (req, res, next) =>{
    const page = req.query.page;

    postController.getposts(page)
        .then(posts => {
            res.locals.posts = posts;
            res.render('index');
        })
        .catch(err => next(err))
});

router.get('/getCreatePostPage', (req, res, next) => {
    res.render('createpost');
});

router.post('/postCreatePost', (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const userId = req.session.user.id;

    postController.createPost(title, content, userId)
     .then(result => {
        console.log("request sent");
        res.redirect('/');
     })
     .catch(err => next(err));
});

module.exports = router;