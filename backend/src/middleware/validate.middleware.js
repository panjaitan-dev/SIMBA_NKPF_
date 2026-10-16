const { z } = require('zod');
const validation = require('../lib/validation');

/**
 * Middleware untuk validasi request payload menggunakan Zod Schema
 * @param {z.ZodSchema} schema 
 */
const validate = (schema) => (req, res, next) => {
  try {
    let target = req.body;
    const isWrapped = schema.shape && (schema.shape.body || schema.shape.query || schema.shape.params);

    if (isWrapped) {
      target = {
        body: req.body,
        query: req.query,
        params: req.params,
      };
    }

    const result = schema.safeParse(target);

    if (!result.success) {
      const errors = result.error.errors.map((err) => {
        let fieldPath = err.path.join('.');
        if (err.path[0] === 'body' || err.path[0] === 'query' || err.path[0] === 'params') {
          fieldPath = err.path.slice(1).join('.');
        }
        return {
          field: fieldPath || 'input',
          message: err.message,
        };
      });

      return res.status(400).json({
        success: false,
        message: errors[0]?.message || 'Validasi input gagal',
        errors,
      });
    }

    if (isWrapped) {
      if (result.data.body) req.body = result.data.body;
      if (result.data.query) req.query = result.data.query;
      if (result.data.params) req.params = result.data.params;
    } else {
      req.body = result.data;
    }

    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan validasi sistem' });
  }
};

module.exports = {
  validate,
  z,
  ...validation,
};
