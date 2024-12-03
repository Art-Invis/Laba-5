const express = require('express');
const router = express.Router();
const db = require('./db');

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY; // Replace with a secure key in production

const bcrypt = require('bcrypt');

// Додайте маршрут для реєстрації
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email і пароль обов’язкові' });
    }

    // Перевіряємо, чи користувач уже існує
    const queryCheck = `SELECT * FROM users WHERE email = ?`;
    db.get(queryCheck, [email], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (user) return res.status(400).json({ message: 'Користувач із таким email вже існує' });

        // Хешуємо пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Зберігаємо нового користувача
        const queryInsert = `INSERT INTO users (email, password) VALUES (?, ?)`;
        db.run(queryInsert, [email, hashedPassword], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Реєстрація успішна!' });
        });
    });
});

// Маршрут для логіну
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Невірні дані для входу' });
        }

        // Генерація JWT токена
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    });
});


// Отримати всі продукти
router.get('/items', (req, res) => {
  const { type, search, sort, order } = req.query;
  let query = `SELECT * FROM products`;
  const params = [];

  if (type) {
    query += ` WHERE type = ?`;
    params.push(type);
  }

  if (search) {
    query += type ? ` AND title LIKE ?` : ` WHERE title LIKE ?`;
    params.push(`%${search}%`);
  }

  if (sort) {
    const orderDirection = order === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sort} ${orderDirection}`;
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Помилка отримання продуктів" });
    } else {
      res.json(rows);
    }
  });
});

// Отримати продукт за ID разом із варіантами
router.get('/items/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM products WHERE id = ?`;

  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const variantsSql = `SELECT * FROM product_variants WHERE product_id = ?`;
    db.all(variantsSql, [id], (err, variants) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ ...row, selectableOptions: variants });
    });
  });
});

router.get('/cart', authenticate, (req, res) => {
  const userId = req.user.id;

  const query = `SELECT cart_data FROM carts WHERE user_id = ?`;
  db.get(query, [userId], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ cart: row ? JSON.parse(row.cart_data) : [] });
  });
});

router.post('/cart', authenticate, (req, res) => {
  const userId = req.user.id;
  const { cartData } = req.body;

  const query = `
      INSERT INTO carts (user_id, cart_data)
      VALUES (?, ?)
      ON CONFLICT(user_id) DO UPDATE SET cart_data = ?`;
  
  db.run(query, [userId, JSON.stringify(cartData), JSON.stringify(cartData)], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Кошик оновлено успішно' });
  });
});

// Додати товар до кошика
router.post('/cart', (req, res) => {
  const { id, selectedOption, quantity } = req.body;

  const sql = `SELECT * FROM product_variants WHERE product_id = ? AND value = ?`;
  db.get(sql, [id, selectedOption], (err, variant) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!variant || variant.quantity < quantity) {
      return res.status(400).json({
        success: false,
        error: `Only ${variant?.quantity || 0} items available for this option.`,
      });
    }

    res.json({ success: true, message: "Item added to cart." });
  });
});

// Оновити доступну кількість
router.post('/update-quantity', (req, res) => {
  const { productId, selectedOption, quantity } = req.body;

  const sql = `
    UPDATE product_variants
    SET quantity = quantity - ?
    WHERE product_id = ? AND value = ?
  `;

  db.run(sql, [quantity, productId, selectedOption], function (err) {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    res.json({ success: true, message: "Quantity updated successfully." });
  });
});

module.exports = router;
