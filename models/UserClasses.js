/* eslint-disable camelcase */
// import { Model } from "objection";
import BaseModel from "./BaseModel";

export default class UserClasses extends BaseModel {
  // Table name is the only required property.
  static get tableName() {
    return "User-Classes";
  }

  // Objection.js assumes primary key is `id` by default

  static get jsonSchema() {
    return {
      type: "object",
      required: ["classNumber"],

      properties: {
        id: { type: "integer" },
        classNumber: { type: "integer" },
        userEmail: { type: "string" },
        completionStatus: { type: "string" },
      },
    };
  }
}
