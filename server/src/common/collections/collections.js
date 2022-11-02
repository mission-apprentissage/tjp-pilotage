import { dbCollection } from "../mongodbClient.js";
import * as logsDescriptor from "./logs.js";
import * as migrationsDescriptor from "./migrations.js";
import * as usersDescriptor from "./users.js";
import * as rolesDescriptor from "./roles.js";
import * as jwtSessionsDescriptor from "./jwtSessions.js";

export function getCollectionDescriptors() {
  return [logsDescriptor, migrationsDescriptor, usersDescriptor, rolesDescriptor, jwtSessionsDescriptor];
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

export function rolesDb() {
  return dbCollection(rolesDescriptor.name);
}

export function jwtSessionsDb() {
  return dbCollection(jwtSessionsDescriptor.name);
}
