import express from "express";
import createError from "http-errors";
import path from "path";
import cors from "cors";
import routes from "./routes";

const app = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(require("morgan")("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use("/api", routes);

app.use((req, res, next) => next(createError(404)));

app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: err
    }
  });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
