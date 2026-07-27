import mongoose from "mongoose";

// Global mongoose plugin to remove __v and sensitive keys from all query outputs
mongoose.plugin((schema) => {
  const toJSON = schema.get("toJSON") || {};
  const toObject = schema.get("toObject") || {};

  schema.set("toJSON", {
    ...toJSON,
    transform: (doc: any, ret: any, options: any) => {
      delete ret.__v;
      delete ret.passwordResetCode;
      delete ret.passwordResetCodeExpires;
      delete ret.passwordResetCodeVerify;
      if (typeof toJSON.transform === "function") {
        return toJSON.transform(doc, ret, options);
      }
      return ret;
    },
  });

  schema.set("toObject", {
    ...toObject,
    transform: (doc: any, ret: any, options: any) => {
      delete ret.__v;
      delete ret.passwordResetCode;
      delete ret.passwordResetCodeExpires;
      delete ret.passwordResetCodeVerify;
      if (typeof toObject.transform === "function") {
        return toObject.transform(doc, ret, options);
      }
      return ret;
    },
  });
});

export const connectDB = () => {
  const dbUri = process.env.MONGO_URI || process.env.MONGO_URL;

  if (!dbUri) {
    console.error(
      "Error: MONGO_URI or MONGO_URL is not defined in the environment variables.",
    );
    process.exit(1);
  }

  // Connect to database
  mongoose
    .connect(dbUri)
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};