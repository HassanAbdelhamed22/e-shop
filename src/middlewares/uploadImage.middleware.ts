import multer from "multer";
import type { Request, Response, NextFunction } from "express";
import sharp from "sharp";
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
      await sharp(req.file.buffer)
        .resize(options.width, options.height)
        .toFormat("jpeg")
        .jpeg({ quality: options.quality || 90 })
        .toFile(`uploads/${options.folder}/${filename}`);

      req.body[fieldName] = filename;
      next();
    } catch (err) {
      next(err);
    }
  };
};

