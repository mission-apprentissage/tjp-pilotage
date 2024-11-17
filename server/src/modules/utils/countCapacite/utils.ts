import { ExpressionBuilder, ExpressionWrapper, RawBuilder } from "kysely";
import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";
import { FIRST_ANNEE_CAMPAGNE } from "shared/time/FIRST_ANNEE_CAMPAGNE";

import { DB } from "../../../db/db";

export const exceptionCampagne2023 = ({
  eb,
  count,
}: {
  eb: ExpressionBuilder<DB, "campagne">;
  count:
    | RawBuilder<number>
    | ExpressionWrapper<DB, "demande" | "campagne", number>;
}) =>
  eb
    .case()
    .when("campagne.annee", "=", FIRST_ANNEE_CAMPAGNE)
    .then(0)
    .else(count)
    .end();

export const inQ1 = (
  eb: ExpressionBuilder<DB, "positionFormationRegionaleQuadrant">
) =>
  eb(
    eb.ref("positionFormationRegionaleQuadrant.positionQuadrant"),
    "=",
    PositionQuadrantEnum.Q1
  );

export const inQ2 = (
  eb: ExpressionBuilder<DB, "positionFormationRegionaleQuadrant">
) =>
  eb(
    eb.ref("positionFormationRegionaleQuadrant.positionQuadrant"),
    "=",
    PositionQuadrantEnum.Q2
  );

export const inQ1Q2 = (
  eb: ExpressionBuilder<DB, "positionFormationRegionaleQuadrant">
) =>
  eb(eb.ref("positionFormationRegionaleQuadrant.positionQuadrant"), "in", [
    PositionQuadrantEnum.Q1,
    PositionQuadrantEnum.Q2,
  ]);

export const inQ3 = (
  eb: ExpressionBuilder<DB, "positionFormationRegionaleQuadrant">
) =>
  eb(
    eb.ref("positionFormationRegionaleQuadrant.positionQuadrant"),
    "=",
    PositionQuadrantEnum.Q3
  );

export const inQ4 = (
  eb: ExpressionBuilder<DB, "positionFormationRegionaleQuadrant">
) =>
  eb(
    eb.ref("positionFormationRegionaleQuadrant.positionQuadrant"),
    "=",
    PositionQuadrantEnum.Q4
  );

export const inQ3Q4 = (
  eb: ExpressionBuilder<DB, "positionFormationRegionaleQuadrant">
) =>
  eb(eb.ref("positionFormationRegionaleQuadrant.positionQuadrant"), "in", [
    PositionQuadrantEnum.Q3,
    PositionQuadrantEnum.Q4,
  ]);

export const inTransitionEcologique = (eb: ExpressionBuilder<DB, "rome">) =>
  eb(eb.ref("rome.transitionEcologique"), "=", true);
