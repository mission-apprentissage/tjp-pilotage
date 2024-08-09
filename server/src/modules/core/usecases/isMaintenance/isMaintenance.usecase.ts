import { isMaintenanceQuery } from "./isMaintenance.query";

const isMaintenanceFactory = () => async () => {
  return await isMaintenanceQuery();
};

export const isMaintenanceUsecase = isMaintenanceFactory();
