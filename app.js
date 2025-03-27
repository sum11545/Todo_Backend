const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const arr = [];

app.get("/tasks", (req, res) => {
  res.status(200).json({
    message: "All tasks",
    data: arr,
  });
});

app.post("/addTask", (req, res) => {
  const task = req.body.task;
  arr.push(task);
  res.status(201).json({
    message: "Task added successfully",
    data: arr,
  });
});

app.delete("/deleteTask/:index", (req, res) => {
  const index = req.params.index;
  arr.splice(index, 1);
  res.status(200).json({
    message: "Task deleted successfully",
  });
});

app.put("/updateTask/:index", (req, res) => {
  const index = req.params.index;
  const task = req.body.task;
  arr[index] = task;
  res.status(200).json({
    message: "Task updated successfully",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
