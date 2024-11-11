/* eslint-disable camelcase */
// import { Model } from "objection";
import BaseModel from "./BaseModel";

export default class Class extends BaseModel {
  // Table name is the only required property.
  static get tableName() {
    return "Class";
  }

  // Objection.js assumes primary key is `id` by default

  static get jsonSchema() {
    return {
      type: "object",
      required: ["number"],

      properties: {
        id: { type: "integer" },
        number: { type: "integer" },
        name: { type: "string" },
        description: { type: "string" },
      },
    };
  }
}
