import * as logsDescriptor from "./logs.js";
import * as migrationsDescriptor from "./migrations.js";
import * as usersDescriptor from "./users.js";
import { dbCollection } from "../mongodb.js";

export function getCollectionDescriptors() {
  return [logsDescriptor, migrationsDescriptor, usersDescriptor];
}

export function migrations() {
  return dbCollection(migrationsDescriptor.name);
}

export function logs() {
  return dbCollection(logsDescriptor.name);
}

export function users() {
  return dbCollection(usersDescriptor.name);
}
