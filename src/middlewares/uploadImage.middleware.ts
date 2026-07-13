import multer from "multer";
import type { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import fs from "fs";
import { ApiError } from "../utils/apiError.ts";

export const uploadSingleImage = (fieldName: string) => {
  const storage = multer.memoryStorage();

  const fileFilter = function (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Invalid file type, only images are allowed", 400));
    }
  };

  const upload = multer({ storage, fileFilter });

  return upload.single(fieldName);
};

interface ResizeImageOptions {
  width: number;
  height: number;
  quality?: number;
  folder: string;
  prefix: string;
  bodyFieldName?: string;
}

export const resizeImage = (options: ResizeImageOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${options.prefix}-${uniqueSuffix}.jpeg`;
    const fieldName = options.bodyFieldName || "image";

    try {
      const uploadDir = `uploads/${options.folder}`;
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      await sharp(req.file.buffer)
        .resize(options.width, options.height)
        .toFormat("jpeg")
        .jpeg({ quality: options.quality || 90 })
        .toFile(`${uploadDir}/${filename}`);

      req.body[fieldName] = filename;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export const uploadMixOfImages = (
  arrayOfFields: { name: string; maxCount: number }[],
) => {
  const storage = multer.memoryStorage();

  const fileFilter = function (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Invalid file type, only images are allowed", 400));
    }
  };

  const upload = multer({ storage, fileFilter });

  return upload.fields(arrayOfFields);
};

export const resizeProductImages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.files) return next();

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    const uploadDir = "uploads/products";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 1- Process imageCover
    if (files.imageCover) {
      const imageCoverFile = files.imageCover[0];
      const imageCoverName = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}-cover.jpeg`;

      await sharp(imageCoverFile.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`${uploadDir}/${imageCoverName}`);

      req.body.imageCover = imageCoverName;
    }

    // 2- Process images gallery
    if (files.images) {
      req.body.images = [];
      await Promise.all(
        files.images.map(async (file, index) => {
          const imageName = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}-${index + 1}.jpeg`;

          await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`${uploadDir}/${imageName}`);

          req.body.images.push(imageName);
        })
      );
    }

    next();
  } catch (err) {
    next(err);
  }
};


