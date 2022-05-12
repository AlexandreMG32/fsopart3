const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please provide the password as an argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://Rabichu:${password}@cluster0.p7ohg.mongodb.net/myApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4];

  const contact = new Person({
    name: name,
    number: number,
  });

  contact.save().then(() => {
    console.log("Contact saved");
    mongoose.connection.close();
  });
}
