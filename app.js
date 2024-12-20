import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
// import PaymentRoutes from "./routes/PaymentRoutes.js";
import db from "./config/Database.js";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import Users from "./models/UserModel.js";
import Tenant from "./models/TenantModel.js";
import fileUpload from "express-fileupload";
import SequelizeStore from "connect-session-sequelize";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

(async () => {
  await db.sync();
})();

app.use(
  session({
    // secret: process.env.SESS_SECRET,
    secret: "blablabla20202020",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      expires: new Date(Date.now() + 86400000),
      maxAge: 30 * 24 * 60 * 60 * 1000,
      domain: "https://consolerent-test.netlify.app",
      httpOnly: true,
      secure: true, // Aktifkan untuk HTTPS
      // secure: "false",
      sameSite: "none", // Dukung cookie lintas-origin
    },
  })
);
app.use(
  cors({
    credentials: true,
    // origin: "*",
    origin: "https://consolerent-test.netlify.app",
    // origin: "https://midtrans-test-ken.netlify.app",
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static("public"));

app.use("/api", router);

store.sync();

export default app;
