const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const connectDB = require('./config/db');
const userRouter = require('./routes/user.routes');
const passport = require('passport');
require('./config/passport');

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-session-secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/auth', userRouter);

// async server start
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running at Port: ${PORT}`);
    });

  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
};

startServer();