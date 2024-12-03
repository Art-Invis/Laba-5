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
// Отримання товарів з кошика
// Кошик: отримання даних
router.get('/cart', authMiddleware, (req, res) => {
  const query = `
    SELECT ci.product_id, ci.selected_option, ci.quantity, ci.price, p.title, p.imageUrl 
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = (SELECT id FROM carts WHERE user_id = ?)
  `;
  db.all(query, [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error: " + err.message });
    }
    res.json(rows);  // Повертаємо всі товари в кошику
  });
});


// Кошик: створення нового кошика для користувача, якщо його немає
router.post('/cart', authMiddleware, (req, res) => {
  const { product_id, selectedOption, quantity } = req.body;

  if (!product_id || !selectedOption || quantity == null) {
    return res.status(400).json({ error: "Invalid cart item data." });
  }

  const selectQuery = `SELECT id FROM carts WHERE user_id = ?`;
  db.get(selectQuery, [req.user.id], (err, row) => {
    if (err) {
      console.error("Database error when selecting cart:", err.message);
      return res.status(500).json({ error: "Database error: " + err.message });
    }

    let cartId = row ? row.id : null;

    if (!cartId) {
      // Якщо кошика немає, створюємо новий кошик
      const insertCartQuery = `INSERT INTO carts (user_id) VALUES (?)`;
      db.run(insertCartQuery, [req.user.id], function (err) {
        if (err) {
          return res.status(500).json({ error: "Database error: " + err.message });
        }
        cartId = this.lastID;  // Отримуємо id нового кошика
      });
    }

    const selectItemQuery = `SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ? AND selected_option = ?`;
    db.get(selectItemQuery, [cartId, product_id, selectedOption], (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Database error: " + err.message });
      }

      if (row) {
        // Якщо товар вже є в кошику, оновлюємо кількість
        const updateItemQuery = `UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ? AND selected_option = ?`;
        db.run(updateItemQuery, [quantity, cartId, product_id, selectedOption], (err) => {
          if (err) {
            return res.status(500).json({ error: "Database error: " + err.message });
          }
          res.status(200).json({ success: true, message: "Cart updated successfully." });
        });
      } else {
        // Якщо товар не знайдений, додаємо новий
        const insertItemQuery = `
          INSERT INTO cart_items (cart_id, product_id, selected_option, quantity, price)
          VALUES (?, ?, ?, ?, ?)`;
        db.run(insertItemQuery, [cartId, product_id, selectedOption, quantity, 100.0], (err) => {
          if (err) {
            return res.status(500).json({ error: "Database error: " + err.message });
          }
          res.status(200).json({ success: true, message: "Item added to cart." });
        });
      }
    });
  });
});


// Додавання товару в кошик
router.post('/cart', authMiddleware, (req, res) => {
  const { product_id, selectedOption, quantity } = req.body;

  if (!product_id || !selectedOption || quantity == null) {
    return res.status(400).json({ error: "Invalid cart item data." });
  }

  const selectQuery = `SELECT id FROM carts WHERE user_id = ?`;
  db.get(selectQuery, [req.user.id], (err, row) => {
    if (err) {
      console.error("Database error when selecting cart:", err.message);
      return res.status(500).json({ error: "Database error: " + err.message });
    }

    let cartId = row ? row.id : null;

    if (!cartId) {
      // Якщо кошика немає, створюємо новий
      const insertCartQuery = `INSERT INTO carts (user_id) VALUES (?)`;
      db.run(insertCartQuery, [req.user.id], function (err) {
        if (err) {
          return res.status(500).json({ error: "Database error: " + err.message });
        }
        cartId = this.lastID;  // Отримуємо id нового кошика
      });
    }

    const selectItemQuery = `SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ? AND selected_option = ?`;
    db.get(selectItemQuery, [cartId, product_id, selectedOption], (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Database error: " + err.message });
      }

      if (row) {
        // Якщо товар вже є в кошику, оновлюємо кількість
        const updateItemQuery = `UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ? AND selected_option = ?`;
        db.run(updateItemQuery, [quantity, cartId, product_id, selectedOption], (err) => {
          if (err) {
            return res.status(500).json({ error: "Database error: " + err.message });
          }
          res.status(200).json({ success: true, message: "Cart updated successfully." });
        });
      } else {
        // Якщо товар не знайдений, додаємо новий
        const insertItemQuery = `
          INSERT INTO cart_items (cart_id, product_id, selected_option, quantity, price)
          VALUES (?, ?, ?, ?, ?)`;
        db.run(insertItemQuery, [cartId, product_id, selectedOption, quantity, 100.0], (err) => {
          if (err) {
            return res.status(500).json({ error: "Database error: " + err.message });
          }
          res.status(200).json({ success: true, message: "Item added to cart." });
        });
      }
    });
  });
});



// Кошик: очищення
// Кошик: видалення товару
router.delete('/cart', authMiddleware, (req, res) => {
  const { product_id, selected_option } = req.body;
  const query = `
    DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = ?) AND product_id = ? AND selected_option = ?
  `;
  db.run(query, [req.user.id, product_id, selected_option], (err) => {
    if (err) {
      return res.status(500).json({ error: "Database error: " + err.message });
    }
    res.json({ success: true, message: "Item removed from cart" });
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
