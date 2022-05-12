const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  return Math.floor(Math.random() * (1000000000 - 0));
};

morgan.token("post", (req, res) => {
  if (req.method === "POST") {
    return `{"name":${JSON.stringify(req.body.name)}, "number":${JSON.stringify(
      req.body.number
    )}}`;
  } else {
    return "";
  }
});
app.use(express.static("build"));
app.use(express.json());
app.use(morgan(":method :url :response-time :post"));

app.get("", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/info", (req, res) => {
  const personsNumber = persons.length;
  const date = new Date();
  res.send(
    `<p>Phonebook has info for ${personsNumber} people.</p>\n <p>${date}</p>`
  );
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (!person) {
    res.status(404).end();
  } else {
    res.json(person);
  }
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Has to have a name and a number",
    });
  }

  if (
    persons
      .map((person) => person.name.toLowerCase())
      .includes(body.name.toLowerCase())
  ) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
