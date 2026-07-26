import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import morgan from "morgan";
import { globalError } from "./middlewares/error.middleware.ts";
import { ApiError } from "./utils/apiError.ts";
import mountRoutes from "./routes/index.ts";
import cors from "cors";
import compression from "compression";
import { webhookCheckout } from "./controllers/order.controller.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors())

app.options("/*splat", cors())

app.use(compression())

app.set("query parser", "extended");

app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

app.get("/orders/success", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Order Success</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 50px; background-color: #f4f6f8; }
          .container { max-width: 500px; margin: 50px auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          h1 { color: #24b47e; margin-bottom: 10px; }
          p { color: #4f5b66; font-size: 1.1em; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎉 Payment Successful!</h1>
          <p>Thank you for your purchase. Your payment was received, and we are processing your order now.</p>
        </div>
      </body>
    </html>
  `);
});

app.get("/orders/cancel", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Order Cancelled</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 50px; background-color: #f4f6f8; }
          .container { max-width: 500px; margin: 50px auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          h1 { color: #df1b4b; margin-bottom: 10px; }
          p { color: #4f5b66; font-size: 1.1em; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>❌ Payment Cancelled</h1>
          <p>Your payment session was cancelled. If this was a mistake, you can return to your cart and try checking out again.</p>
        </div>
      </body>
    </html>
  `);
});

// Middlewares
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Routes
mountRoutes(app);

// Handle invalid routes
app.all("/*splat", (req, res, next) => {
  next(new ApiError(`Route ${req.originalUrl} not found`, 404));
});

// Global Error Handling Middleware
app.use(globalError);

export default app;
