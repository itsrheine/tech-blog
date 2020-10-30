const router = require('express').Router();
const { Post, Comment, User } = require('../models/');
const withAuth = require('../utils/auth');

//add withAuth
router.get('/', (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('dashboard', { posts, loggedIn: false });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// router.get('/new', withAuth, (req, res) => {
//     res.render('new-post', { layout: "main" });
// })

// router.get('/edit/:id', withAuth, (req, res) => {
//     Post.findOne({
//         where: {
//             id: req.params.id
//         },
//         attributes: [
//             'id',
//             'title',
//             'content',
//             'created_at'
//         ],
//         include: [
//             {
//                 model: Comment,
//                 attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
//                 include: {
//                     model: User,
//                     attributes: ['username']
//                 }
//             },
//             {
//                 model: User,
//                 attributes: ['username']
//             }
//         ]
//     })
//     .then(dbPostData => {
//         if (dbPostData) {
//             const post = dbPostData.get({ plain: true });

//             res.render('edit-post', { layout: "main", post, loggedIn: true });
//         } else {
//             res.status(404).json({ message: 'No post found with this id'});
//             return;
//         }
//     })
//     .catch(err => {
//         res.status(500).json(err);
//     });
// })

module.exports = router;
