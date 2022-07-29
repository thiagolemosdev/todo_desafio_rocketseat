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

//Create to dos
app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, date } = request.body;

  const id = uuidv4();
  // const id = "1";
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
  return response.status(201).send();
});

// Alterar title e deadline
app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, date } = request.body;
  const { id } = request.params;

  const deadline = new Date(date + " 00:00");

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(400).json({ erro: "To do not found!" });
  }
  todo.title = title;
  todo.deadline = deadline;
  return response.status(201).send();

  // user.todos.forEach((todo) => {
  //   if (todo.id === id) {
  //     todo.title = title;
  //     todo.deadline = deadline;
  //   }
  // });
});

// Alterar done
app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(400).json({ erro: "To do not found!" });
  }

  todo.done = true;
  return response.status(201).send();
});

// Delete To do
app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const indexTodo = user.todos.findIndex((todo) => todo.id === id);

  if (indexTodo === -1) {
    return response.status(400).json({ error: "To do not found!" });
  }

  user.todos.splice(indexTodo, 1);
  return response.status(201).json(user.todos);
});

module.exports = app;
