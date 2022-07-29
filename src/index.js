const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).json({ error: "Username dont exists!" });
  }
  request.user = user;
  return next();
}

// Criar usuario
app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);
  if (userAlreadyExists) {
    return response.status(400).json({ error: "Username already exists!" });
  }

  const id = uuidv4();

  users.push({
    name,
    username,
    id,
    todos: [],
  });
  return response.status(201).send();
});

// Visualizar tarefas
app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(201).json(user.todos);
});

//Create todos
app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, date } = request.body;

  console.log(date);

  const id = uuidv4();
  const done = false;
  const deadline = new Date(date + " 00:00");

  const createTodo = {
    id,
    title,
    done,
    deadline,
    created_at: new Date(),
  };

  user.todos.push(createTodo);
  console.log(user.todos);
  return response.status(201).send();
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
