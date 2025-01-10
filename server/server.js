const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

const db = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "tihokote",
  database: "fitness_center",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

// Маршрут для получения списка тренеров
app.get("/trainers", (req, res) => {
  const query =
    "SELECT id, CONCAT(firstName, ' ', lastName) AS name, phone, speciality FROM trainer";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching trainers:", error);
      return res
        .status(500)
        .send("Ошибка получения списка тренеров. Попробуйте снова.");
    }
    res.status(200).json(results);
  });
});

// Маршрут для добавления нового клиента
app.post("/add_client", (req, res) => {
  const { firstName, lastName, phone, email, password } = req.body;

  const query = "CALL add_client(?, ?, ?, ?, ?)";

  db.query(
    query,
    [firstName, lastName, phone, email, password],
    (error, results) => {
      if (error) {
        console.error("Error adding client: ", error);
        return res
          .status(500)
          .send("Ошибка при добавлении клиента. Попробуйте снова.");
      }
      res.status(200).send("Client added successfully");
    }
  );
});

// Маршрут для входа пользователя
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query =
    "SELECT id, firstName, lastName, phone, email FROM client WHERE email = ? AND password = ?";

  db.query(query, [email, password], (error, results) => {
    if (error) {
      console.error("Error logging in: ", error);
      return res.status(500).send("Ошибка входа. Попробуйте снова.");
    }
    if (results.length === 0) {
      return res.status(401).send("Неверные учетные данные.");
    }
    res.status(200).json({ success: true, user: results[0] });
  });
});

// Маршрут для удаления профиля пользователя
app.delete("/delete_client/:id", (req, res) => {
  const clientId = req.params.id;

  const query = "DELETE FROM client WHERE id = ?";

  db.query(query, [clientId], (error, results) => {
    if (error) {
      console.error("Error deleting client: ", error);
      return res
        .status(500)
        .send("Ошибка при удалении профиля. Попробуйте снова.");
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Профиль не найден.");
    }
    res.status(200).send("Client deleted successfully");
  });
});

// Маршрут для получения расписания занятий
app.get("/schedule", (req, res) => {
  const { trainerId, date } = req.query;

  let query = `
    SELECT c.id, c.name, c.duration, c.beginAt, c.price, h.name AS hall_name
    FROM class c
    JOIN hall h ON c.hall_id = h.id
    WHERE 1=1
  `;

  const queryParams = [];

  if (trainerId) {
    query += " AND c.trainer_id = ?";
    queryParams.push(trainerId);
  }

  if (date) {
    query += " AND DATE(c.beginAt) = ?";
    queryParams.push(date);
  }

  db.query(query, queryParams, (error, results) => {
    if (error) {
      console.error("Error fetching schedule:", error);
      return res
        .status(500)
        .send("Ошибка получения расписания. Попробуйте снова.");
    }
    res.status(200).json(results);
  });
});

// Маршрут для записи на занятие
app.post("/book", (req, res) => {
  const { classId, userId } = req.body;
  const registrationDate = new Date();

  const query = `
    INSERT INTO sign_for_class(client_id, class_id, date)
    VALUES (?, ?, ?)
  `;

  db.query(query, [userId, classId, registrationDate], (error, results) => {
    if (error) {
      console.error("Error booking class:", error);
      return res
        .status(500)
        .send("Ошибка записи на занятие. Попробуйте снова.");
    }
    res.status(200).send("Вы успешно записались на занятие.");
  });
});

// Маршрут для получения записей пользователя
app.get("/user_bookings/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT s.id, c.name AS class_name, c.beginAt, h.name AS hall_name
    FROM sign_for_class s
    JOIN class c ON s.class_id = c.id
    JOIN hall h ON c.hall_id = h.id
    WHERE s.client_id = ?
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching user bookings:", error);
      return res
        .status(500)
        .send("Ошибка получения записей пользователя. Попробуйте снова.");
    }
    console.log("User bookings:", results); // Add this line to log the results
    res.status(200).json(results);
  });
});

// Маршрут для отмены записи
app.delete("/cancel_booking/:bookingId", (req, res) => {
  const bookingId = req.params.bookingId;

  const query = "DELETE FROM sign_for_class WHERE id = ?";

  db.query(query, [bookingId], (error, results) => {
    if (error) {
      console.error("Error canceling booking:", error);
      return res
        .status(500)
        .send("Ошибка при отмене записи. Попробуйте снова.");
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Запись не найдена.");
    }
    res.status(200).send("Запись успешно отменена.");
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
