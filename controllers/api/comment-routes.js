const router = require('express').Router();
const { Comment } = require('../../models/');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      userId: req.session.userId,
    });
    res.json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/', (req, res) => {
  Comment.findAll()
      .then(dbCommentData => res.json(dbCommentData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

router.delete('/:id', (req, res) => {
  if (req.session) {
      Comment.destroy({
          where: {
              id: req.params.id
          }
      })
          .then(dbCommentData => {
              if (!dbCommentData) {
                  res.status(404).json({ message: 'No comment found with this id!' });
                  return;
              }
              res.json(dbCommentData);
          })
          .catch(err => {
              console.log(err);
              res.status(500).json(err);
          });
  }
});

module.exports = router;
