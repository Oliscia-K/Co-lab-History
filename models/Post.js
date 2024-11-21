/* eslint-disable camelcase */
// import { Model } from "objection";
import BaseModel from "./BaseModel";

export default class Posts extends BaseModel {
  // Table name is the only required property.
  static get tableName() {
    return "Posts";
  }

  // Objection.js assumes primary key is `id` by default

  static get jsonSchema() {
    return {
      type: "object",
      required: ["creator"],

      properties: {
        id: { type: "integer" },
        creator: { type: "string" },
        title: { type: "string" },
        content: { type: "string" },
        edited: { type: "string" },
      },
    };
  }
}
