const express = require("express");
const app = express();
const pool = require("./db");
require("dotenv").config();
const port = process.env.PORT || 3000;
const cors = require("cors");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/tasks", async (req, res) => {
  await pool.query("SELECT * FROM Sumit", (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Error fetching tasks" });
    }
    res.json(results.rows);
  });
});

app.post("/addTask", async (req, res) => {
  const { tasks } = req.body;
  console.log("Task Recvied", tasks);

  if (!tasks) {
    res.status(400).json({
      message: "Task is required",
    });
  }
  try {
    await pool.query(`INSERT INTO Sumit (taskname) VALUES ($1)`, [tasks]);
    res.status(201).json({ message: "Task added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

app.delete("/deleteTask/", async (req, res) => {
  const name = req.body.name;

  console.log("Name Recived", name);

  if (!name) {
    res.status(404).send({ message: "Taskname or id is required " });
  }

  try {
    await pool.query("DELETE FROM Sumit WHERE taskname = $1", [name]);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

app.put("/updateTask/:id", async (req, res) => {
  const index = parseInt(req.params.id);
  const updatetask = req.body.task;
  console.log("index reviced", index);
  console.log("updated value", updatetask);

  if (!index || !updatetask) {
    res.status(404).send({ message: "Index and task are required " });
  }
  try {
    await pool.query(`UPDATE Sumit SET taskname =$1 WHERE id = $2`, [
      updatetask,
      index,
    ]);
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {}
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
