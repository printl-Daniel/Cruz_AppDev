const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const port = 5000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.post("/book", (req, res) => {
  const booking = {
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    destination: req.body.destination,
    dates: req.body.dates,
    requests: req.body.requests,
  };

  const bookingsFilePath = path.join(__dirname, "bookings.json");

  fs.readFile(bookingsFilePath, "utf8", (err, data) => {
    let bookings = [];
    if (!err && data) {
      bookings = JSON.parse(data);
    }

    bookings.push(booking);

    fs.writeFile(bookingsFilePath, JSON.stringify(bookings, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Error saving booking");
      }
      res.redirect("/book-history");
    });
  });
});

app.post("/delete-booking/:index", (req, res) => {
  const index = parseInt(req.params.index, 10);
  const bookingsFilePath = path.join(__dirname, "bookings.json");

  fs.readFile(bookingsFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error loading booking history");
    }

    const bookings = JSON.parse(data);

    if (index >= 0 && index < bookings.length) {
      bookings.splice(index, 1);

      fs.writeFile(
        bookingsFilePath,
        JSON.stringify(bookings, null, 2),
        (err) => {
          if (err) {
            return res.status(500).send("Error saving booking history");
          }
          res.redirect("/book-history");
        }
      );
    } else {
      res.status(404).send("Booking not found");
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/destination", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "destination-page.html"));
});

app.get("/book", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "book.html"));
});

app.get("/book-history", (req, res) => {
  const bookingsFilePath = path.join(__dirname, "bookings.json");

  fs.readFile(bookingsFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error loading booking history");
    }

    const bookings = JSON.parse(data);
    res.render("book-history", { bookings });
  });
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "contact.html"));
});

app.use((req, res) => {
  res.status(404).send("404 - Not Found");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
