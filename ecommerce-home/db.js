const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'songs.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Помилка підключення до БД:", err.message);
  } else {
    console.log("Підключення до SQLite успішне.");
  }
});

db.serialize(() => {
  // Таблиця продуктів
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    title TEXT,
    description TEXT,
    price REAL,
    releaseDate TEXT,
    imageUrl TEXT
  )`, (err) => {
    if (err) {
      console.error("Помилка при створенні таблиці products:", err.message);
    } else {
      console.log("Таблиця products створена або вже існує.");
    }
  });

  // Таблиця варіантів продуктів
  db.run(`CREATE TABLE IF NOT EXISTS product_variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    label TEXT,
    value TEXT,
    quantity INTEGER,
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`, (err) => {
    if (err) {
      console.error("Помилка при створенні таблиці product_variants:", err.message);
    } else {
      console.log("Таблиця product_variants створена або вже існує.");
    }
  });
});

// Додавання продуктів
const insertProduct = (type, title, description, price, releaseDate, imageUrl, variants) => {
  db.run(
    `INSERT INTO products (type, title, description, price, releaseDate, imageUrl) VALUES (?, ?, ?, ?, ?, ?)`,
    [type, title, description, price, releaseDate, imageUrl],
    function(err) {
      if (err) {
        console.error("Помилка при додаванні продукту:", err.message);
      } else {
        console.log("Продукт додано успішно.");
        variants.forEach(variant => {
          db.run(
            `INSERT INTO product_variants (product_id, label, value, quantity) VALUES (?, ?, ?, ?)`,
            [this.lastID, variant.label, variant.value, variant.quantity],
            (err) => {
              if (err) {
                console.error("Помилка при додаванні варіанту:", err.message);
              } else {
                console.log(`Варіант ${variant.label} додано.`);
              }
            }
          );
        });
      }
    }
  );
};

const seedDatabase = () => {
  // Tickets
  insertProduct("tickets", "Coldplay Concert Ticket", "Coldplay live in concert.", 50, "2023-06-12", "/tickets.jpg", [
    { label: 'Standard', value: 'standard', quantity: 100 },
    { label: 'VIP', value: 'vip', quantity: 50 },
    { label: 'Student', value: 'student', quantity: 200 },
  ]);

  insertProduct("tickets", "Eminem Concert Ticket", "Experience Eminem live with exclusive concert ticket.", 70, "2023-07-20", "/tickets.jpg", [
    { label: 'Standard', value: 'standard', quantity: 120 },
    { label: 'VIP', value: 'vip', quantity: 40 },
    { label: 'Student', value: 'student', quantity: 80 },
  ]);

  // Merchandise
  insertProduct("merch", "Eminem Hoodie", "Official Eminem Hoodie for fans.", 40, "2023-05-15", "/merch.jpg", [
    { label: 'Small (S)', value: 'small', quantity: 20 },
    { label: 'Medium (M)', value: 'medium', quantity: 15 },
    { label: 'Large (L)', value: 'large', quantity: 10 },
    { label: 'Extra Large (XL)', value: 'xl', quantity: 5 },
  ]);

  insertProduct("merch", "Twenty One Pilots Band T-shirt", "Official Twenty One Pilots T-shirt.", 25, "2023-06-10", "/merch.jpg", [
    { label: 'Small (S)', value: 'small', quantity: 30 },
    { label: 'Medium (M)', value: 'medium', quantity: 25 },
    { label: 'Large (L)', value: 'large', quantity: 20 },
  ]);

  insertProduct("merch", "Linkin Park Cap", "Official Linkin Park cap for fans.", 30, "2023-02-15", "/merch.jpg", [
    { label: 'One Size Fits All', value: 'one_size', quantity: 50 },
  ]);

  // Albums
  insertProduct("albums", "Imagine Dragons - Evolve", "The hit album 'Evolve' featuring 'Believer' and 'Thunder'.", 18, "2023-07-20", "/album.jpg", [
    { label: 'CD', value: 'cd', quantity: 100 },
    { label: 'Vinyl', value: 'vinyl', quantity: 50 },
    { label: 'Digital', value: 'digital', quantity: 200 },
  ]);

  insertProduct("albums", "Eminem - The Eminem Show", "Classic Eminem album featuring 'Without Me' and 'Cleanin' Out My Closet'.", 20, "2023-09-12", "/album.jpg", [
    { label: 'CD', value: 'cd', quantity: 120 },
    { label: 'Vinyl', value: 'vinyl', quantity: 30 },
    { label: 'Digital', value: 'digital', quantity: 300 },
  ]);

  // Instruments
  insertProduct("instruments", "Fender Electric Guitar", "High-quality Fender electric guitar.", 200, "2023-08-15", "/instruments.jpg", [
    { label: 'Electric', value: 'electric', quantity: 5 },
  ]);

  insertProduct("instruments", "Yamaha Acoustic Guitar", "Yamaha high-quality acoustic guitar.", 150, "2023-03-15", "/instruments.jpg", [
    { label: 'Acoustic', value: 'acoustic', quantity: 8 },
  ]);

  // Vinyl
  insertProduct("vinyl", "The Beatles - Abbey Road Vinyl", "A classic Beatles' 'Abbey Road' vinyl album.", 100, "2023-10-05", "/vinyl.jpg", [
    { label: 'Standard Edition', value: 'standard', quantity: 20 },
    { label: 'Collector\'s Edition', value: 'collectors', quantity: 10 },
  ]);
};


// Заповнення бази даних
// seedDatabase();
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS carts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      cart_data TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id)
  )`);
});

module.exports = db;
