import * as logsDescriptor from "./logs.js";
import * as migrationsDescriptor from "./migrations.js";
import * as usersDescriptor from "./users.js";
import * as jwtSessionsDescriptor from "./jwtSessions.js";
import { dbCollection } from "../mongodbClient.js";

export function getCollectionDescriptors() {
  return [logsDescriptor, migrationsDescriptor, usersDescriptor, jwtSessionsDescriptor];
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

export function jwtSessionsDb() {
  return dbCollection(jwtSessionsDescriptor.name);
}
