var express = require('express');
var router = express.Router();

const pool = require('../db/pool');

/**
 * Todoを全件取得する
 * @returns {Object[]} data
 * @returns {number} data.id - ID
 * @returns {string} data.content - 内容
 * @returns {boolean} data.isCompleted - 完了/未完了
 */
router.get('/', function (req, res, next) {
  pool.query('SELECT * FROM todos', function (error, results) {
    if (error) {
      console.log(error, process.env);
      res.status(500).json({
        status: '500 Internal Server Error',
        error: error,
      });
    }

    res.status(200).json({
      data: results.rows,
    });
  });
});

/**
 * Todoを新規登録する
 * @returns {string} status - success
 */
router.post('/', function (req, res, next) {
  const { content, isCompleted } = req.body.todos;

  pool.query(
    'INSERT INTO todos(content, isCompleted) VALUES($1, $2)',
    [content, isCompleted],
    function (error, results) {
      if (error) {
        res.status(500).json({
          status: '500 Internal Server Error',
          error: error,
        });
      }

      res.status(200).json({
        status: 'success',
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
  const { content, isCompleted } = req.body.todos;
  pool.query(
    'UPDATE todos SET content = $1, isCompleted = $2 WHERE id = $3',
    [content, isCompleted, id],
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
