import * as logsDescriptor from "./logs.js";
import * as migrationsDescriptor from "./migrations.js";
import * as usersDescriptor from "./users.js";
import { dbCollection } from "../mongodb.js";

export function getCollectionDescriptors() {
  return [logsDescriptor, migrationsDescriptor, usersDescriptor];
}

export function migrationsDb() {
  return dbCollection(migrationsDescriptor.name);
}

export function logsDb() {
  return dbCollection(logsDescriptor.name);
}

export function usersDb() {
  return dbCollection(usersDescriptor.name);
}
