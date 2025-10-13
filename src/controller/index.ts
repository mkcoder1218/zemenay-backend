import { Request, Response } from "express";
import { generateService } from "../service/service";
import jwt from "jsonwebtoken";
import { buildSequelizeOptions } from "../middleware/parser";
import { asyncHandler } from "../utils/asyncHandler";
import { model as models } from "../model/model";

// Simple validation passthrough
const validateInput = (modelName: string, data: any) => data;

// Map string to generated service
const getService = (modelName: string) => generateService(modelName);

export const generateController = (modelName: string) => {
  const service = getService(modelName);
  const userService = getService("User");

  const sendResponse = (
    res: Response,
    statusCode: number,
    status: "success" | "error",
    message: string,
    data: any = null,
    meta: any = {}
  ) => {
    res.status(statusCode).json({
      status,
      message,
      count: Array.isArray(data) ? data.length : data ? 1 : 0,
      data,
      meta,
      timestamp: new Date().toISOString(),
    });
  };

  return {
     getAll: asyncHandler(async (req: Request, res: Response) => {
      const options = buildSequelizeOptions(req.query.q as string);

      // ✅ map any string model includes again using global models
      if (options.include && Array.isArray(options.include)) {
        options.include = options.include.map((inc: any) => {
          if (typeof inc.model === "string" && models[inc.model]) {
            return { ...inc, model: models[inc.model] };
          }
          return inc;
        });
      }

      const items = await service.getAll(options);
      sendResponse(res, 200, "success", `${modelName} list fetched`, items, {
        limit: options.limit,
        offset: options.offset,
      });
    }),

    // 🟢 GET ONE
    getOne: asyncHandler(async (req: Request, res: Response) => {
      const id = req.params.id;
      const item = await service.getOne(id);
      sendResponse(res, 200, "success", `${modelName} fetched`, item);
    }),

    create: asyncHandler(async (req: Request, res: Response) => {
      let validatedData = validateInput(modelName, req.body);
        if (modelName === "File" && (req as any).file) {
    validatedData = {
      ...validatedData,
      url: `/uploads/${(req as any).file.filename}`,
      path: (req as any).file.path,
    };
  }
      const item = await service.create(validatedData);
      sendResponse(res, 201, "success", `${modelName} created successfully`, item);
    }),

    update: asyncHandler(async (req: Request, res: Response) => {
      const validatedData = validateInput(modelName, req.body);
      const updated = await service.update(req.params.id, validatedData);
      sendResponse(res, 200, "success", `${modelName} updated successfully`, updated);
    }),

    delete: asyncHandler(async (req: Request, res: Response) => {
      await service.delete(req.params.id);
      sendResponse(res, 200, "success", `${modelName} deleted successfully`);
    }),

    getMe: asyncHandler(async (req: Request, res: Response) => {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      const user = await userService.getMe(decoded.id);
      res.json(user);
    }),
  };
};
