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
  try {
    const results = await pool.query("SELECT * FROM Sumit");
    res.json(results.rows);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Error fetching tasks" });
  }
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
    const result = await pool.query(
      `INSERT INTO Sumit (taskname) VALUES ($1)`,
      [tasks]
    );
    if (result) {
      return res.status(201).json({ message: "Task added successfully" });
    } else {
      return res.status(400).json({ message: "Task not added" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

app.delete("/deleteTask", async (req, res) => {
  const name = req.body.name;

  console.log("Name Recived", name);

  if (!name) {
    return res.status(404).send({ message: "Taskname or id is required " });
  }

  try {
    const result = await pool.query("DELETE FROM Sumit WHERE taskname = $1", [
      name,
    ]);
    if (result.rowCount > 0) {
      return res.status(200).json({ message: "Task deleted successfully" });
    } else {
      return res.status(404).json({ message: "Task not found" });
    }
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
    return res.status(404).send({ message: "Index and task are required " });
  }
  try {
    const result = await pool.query(
      `UPDATE Sumit SET taskname =$1 WHERE id = $2`,
      [updatetask, index]
    );
    if (result.rowCount > 0) {
      return res.status(200).json({ message: "Task updated successfully" });
    } else {
      return res.status(404).json({ message: "Task not update" });
    }
  } catch (error) {}
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
