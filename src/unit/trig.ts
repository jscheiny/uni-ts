import { Measure } from "../measure/numberMeasure";
import { MetricSystem, radians } from "./base";
import { Dimensionless, Length, PlaneAngle } from "./quantities";

/**
 * `Math.acos` for `number` measures.
 * @param x a dimensionless value
 * @returns an angle
 */
export const acos = wrapInverseTrigFn(Math.acos);

/**
 * `Math.asin` for `number` measures.
 * @param x a dimensionless value
 * @returns an angle
 */
export const asin = wrapInverseTrigFn(Math.asin);

/**
 * `Math.atan` for `number` measures.
 * @param x a dimensionless value
 * @returns an angle
 */
export const atan = wrapInverseTrigFn(Math.atan);

/**
 * `Math.cos` for `number` measures.
 * @param x an angle
 * @returns a dimensionless value
 */
export const cos = wrapTrigFn(Math.cos);

/**
 * `Math.sin` for `number` measures.
 * @param x an angle
 * @returns a dimensionless value
 */
export const sin = wrapTrigFn(Math.sin);

/**
 * `Math.tan` for `number` measures.
 * @param x an angle
 * @returns a dimensionless value
 */
export const tan = wrapTrigFn(Math.tan);

/**
 * `Math.atan2` for `number` measures.
 * @param x a length
 * @param y a length
 * @returns an angle
 */
export function atan2(y: Length, x: Length): PlaneAngle {
    return Measure.of(Math.atan2(y.value, x.value), radians);
}

type TrigFn = (x: PlaneAngle) => Dimensionless;

function wrapTrigFn(f: (x: number) => number): TrigFn {
    return x => Measure.dimensionless(MetricSystem, f(x.value));
}

type InverseTrigFn = (x: Dimensionless) => PlaneAngle;

function wrapInverseTrigFn(f: (x: number) => number): InverseTrigFn {
    return x => Measure.of(f(x.value), radians);
}
