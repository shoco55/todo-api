const express = require('express');
const router = express.Router();
const cors = require('cors');

router.use(
  cors({
    origin: process.env.PUBLIC_HOST,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

const pool = require('../db/pool');

/**
 * Todoを全件取得する
 * @returns {Object[]} data
 * @returns {number} data.id - ID
 * @returns {string} data.content - 内容
 * @returns {boolean} data.is_completed - 完了/未完了
 */
router.get('/', function (req, res, next) {
  pool.query('SELECT * FROM todos order by id', function (error, results) {
    if (error) {
      res.status(500).json({
        status: '500 Internal Server Error',
        error: error,
      });
    }

    res.status(200).json({
      status: 'success',
      data: results.rows,
    });
  });
});

/**
 * Todoを新規登録する
 * @returns {string} status - success
 */
router.post('/', function (req, res, next) {
  const { content, is_completed } = req.body;

  pool.query(
    'INSERT INTO todos(content, is_completed) VALUES($1, $2) RETURNING id',
    [content, is_completed],
    function (error, results) {
      if (error) {
        res.status(500).json({
          status: '500 Internal Server Error',
          error: error,
        });
      }

      res.status(200).json({
        status: 'success',
        data: results.rows[0],
      });
    }
  );
});

/**
 * 指定されたIDのTodoを更新する
 * @param {number} id - todoID
 * @returns {string} status - success
 */
router.put('/:id', function (req, res, next) {
  const { id } = req.params;
  const { content, is_completed } = req.body;

  pool.query(
    'UPDATE todos SET content = $1, is_completed = $2 WHERE id = $3',
    [content, is_completed, id],
    function (error, results) {
      if (error) {
        res.status(500).json({
          status: '500 Internal Server Error',
          message: error,
        });
      }

      if (results.rowCount === 0) {
        res.status(400).json({
          status: '400 Bad Request',
          message: 'データが存在しません。',
        });
      } else {
        res.status(200).json({
          status: 'success',
        });
      }
    }
  );
});

/**
 * 指定されたIDのTodoを削除する
 * @param {number} id - todoID
 * @returns {string} status - success
 */
router.delete('/:id', function (req, res, next) {
  const { id } = req.params;

  pool.query(
    'DELETE FROM todos WHERE id = $1',
    [id],
    function (error, results) {
      if (error) {
        res.status(500).json({
          status: '500 Internal Server Error',
          message: error,
        });
      }

      if (results.rowCount === 0) {
        res.status(400).json({
          status: '400 Bad Request',
          message: 'データが存在しません。',
        });
      } else {
        res.status(200).json({
          status: 'success',
        });
      }
    }
  );
});

module.exports = router;
