const express = require('express');
const router = express.Router();
const db = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = 'your_secret_key';

// Middleware для авторизації
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized access." });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token." });
    }
    req.user = decoded;
    next();
  });
};

// Реєстрація
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (email, password) VALUES (?, ?)`;

    db.run(query, [email, hashedPassword], (err) => {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: "User already exists." });
        }
        return res.status(500).json({ error: "Database error." });
      }
      res.json({ success: true, message: "User registered successfully." });
    });
  } catch (err) {
    res.status(500).json({ error: "Error hashing password." });
  }
});

// Логін
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = ?`;

  db.get(query, [email], async (err, user) => {
    if (err || !user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Кошик: отримання даних
router.get('/cart', authMiddleware, (req, res) => {
  const query = `SELECT cart_data FROM carts WHERE user_id = ?`;
  db.get(query, [req.user.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database error: " + err.message });
    }
    res.json(row ? JSON.parse(row.cart_data) : []); // Повертаємо порожній масив, якщо кошик порожній
  });
});


router.post('/carts', authMiddleware, (req, res) => {
  const { product_id, selectedOption, quantity } = req.body;

  if (!product_id || !selectedOption || quantity == null) {
    return res.status(400).json({ error: "Invalid cart item data." });
  }

  const selectQuery = `SELECT cart_data FROM carts WHERE user_id = ?`;
  db.get(selectQuery, [req.user.id], (err, row) => {
    if (err) {
      console.error("Database error when selecting cart:", err.message);
      return res.status(500).json({ error: "Database error: " + err.message });
    }

    let cartData = row ? JSON.parse(row.cart_data) : []; // Ініціалізація cartData
    console.log("Existing cart data:", cartData);

    const existingItemIndex = cartData.findIndex(
      (item) => item.product_id === product_id && item.selectedOption === selectedOption
    );

    if (existingItemIndex !== -1) {
      cartData[existingItemIndex].quantity += quantity;
    } else {
      cartData.push({ product_id, selectedOption, quantity });
    }

    const query = `
      INSERT INTO carts (user_id, cart_data)
      VALUES (?, ?)
      ON CONFLICT(user_id) DO UPDATE SET cart_data = ?
    `;
    db.run(query, [req.user.id, JSON.stringify(cartData), JSON.stringify(cartData)], (err) => {
      if (err) {
        console.error("Database error while updating cart:", err.message);
        return res.status(500).json({ error: "Database error: " + err.message });
      }
      console.log(`Cart successfully updated for user ${req.user.id}`);
      res.status(200).json({ success: true, message: "Cart updated successfully.", cart: cartData });
    });
  });
});


// Кошик: очищення
router.delete('/cart', authMiddleware, (req, res) => {
  const query = `DELETE FROM carts WHERE user_id = ?`;

  db.run(query, [req.user.id], (err) => {
    if (err) {
      return res.status(500).json({ error: "Database error: " + err.message });
    }
    res.status(200).json({ success: true, message: "Cart cleared successfully." });
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
      return res.status(500).json({ error: "Database error: " + err.message });
    }
    res.json(rows);
  });
});

// Отримати продукт за ID разом із варіантами
router.get('/items/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM products WHERE id = ?`;

  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database error: " + err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Product not found" });
    }

    const variantsSql = `SELECT * FROM product_variants WHERE product_id = ?`;
    db.all(variantsSql, [id], (err, variants) => {
      if (err) {
        return res.status(500).json({ error: "Database error: " + err.message });
      }
      res.json({ ...row, selectableOptions: variants });
    });
  });
});

module.exports = router;
