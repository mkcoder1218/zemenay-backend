// src/model/model.ts
import { GLOBAL_STATUS, ModelDefinition } from "../types/global";

export const model: Record<string, ModelDefinition> = {
  User: {
    fields: {
      name: { type: "STRING", allowNull: false },
      email: { type: "STRING", allowNull: true },
      password: { type: "STRING", allowNull: false },
      role_id: { type: "UUID", allowNull: true },
    },
    relations: [
      {
        type: "belongsTo",
        model: "Role",
        options: { foreignKey: "role_id", as: "role" },
      }
    ],
    routes: ["create", "read", "update", "delete"],
    auth: { create: false, read: true, update: true, delete: true }, // public register
  },
  Role:{
    fields:{
      name:{type:"STRING",allowNull:false}
    },
        routes: ["create", "read", "update", "delete"],

  },
  BlogCategory: {
    fields: {
      name: { type: "STRING", allowNull: false },
    },
    routes: ["create", "read", "update", "delete"],
  },
  Blog: {
    fields: {
      title: { type: "STRING", allowNull: false },
      description: { type: "STRING", allowNull: false },
    tags: { type: "JSON", allowNull: false }, // <-- JSON array of strings
      category_id: { type: "UUID", allowNull: false },
      file_id: { type: "UUID", allowNull: false },
      user_id:{type:"UUID",allowNull:false}
    },
    relations: [
      {
        type: "belongsTo",
        model: "BlogCategory",
        options: { foreignKey: "category_id", as: "BlogCategory" },
      },
      {
        type: "belongsTo",
        model: "File",
        options: { foreignKey: "file_id", as: "File" },
      },
      {
        type: "belongsTo",
        model: "User",
        options: { foreignKey: "user_id", as: "User" },
      }
    ],
    routes: ["create", "read", "update", "delete"],
  },
  File: {
    fields: {
      description: { type: "STRING", allowNull: true },
      url: { type: "STRING", allowNull: true },
      path: { type: "STRING", allowNull: true },
    },
    routes: ["create", "read", "update", "delete"],
  },
};
