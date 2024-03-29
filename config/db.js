const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://"+process.env.DB_USER_PASS+"@cluster0.2mzdq.mongodb.net/social_project",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));
