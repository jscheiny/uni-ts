import { GenericMeasure, NumericOperations } from "./genericMeasure";
import { createMeasureType, GenericMeasureType } from "./genericMeasureFactory";
import { NthRootFn, SpreadFn, UnaryFn, wrapRootFn, wrapSpreadFn, wrapUnaryFn } from "./genericMeasureUtils";
import { Unit } from "./unitTypeArithmetic";

interface MeasureStaticMethods {
    abs: UnaryFn;
    ceil: UnaryFn;
    floor: UnaryFn;
    fround: UnaryFn;
    round: UnaryFn;
    trunc: UnaryFn;
    hypot: SpreadFn;
    sqrt: NthRootFn<"2">;
    cbrt: NthRootFn<"3">;
}

const staticMethods: MeasureStaticMethods = {
    abs: wrapUnaryFn(Math.abs),
    ceil: wrapUnaryFn(Math.ceil),
    floor: wrapUnaryFn(Math.floor),
    fround: wrapUnaryFn(Math.fround),
    round: wrapUnaryFn(Math.round),
    trunc: wrapUnaryFn(Math.trunc),
    hypot: wrapSpreadFn(Math.hypot),
    sqrt: wrapRootFn(Math.sqrt, "2"),
    cbrt: wrapRootFn(Math.cbrt, "3"),
};

const numericOps: NumericOperations<number> = {
    one: () => 1,
    neg: x => -x,
    add: (x, y) => x + y,
    sub: (x, y) => x - y,
    mult: (x, y) => x * y,
    div: (x, y) => x / y,
    pow: (x, y) => x ** y,
    compare: (x, y) => x - y,
    format: x => `${x}`,
};

export type Measure<B extends {}, U extends Unit<B>> = GenericMeasure<number, B, U>;
export const Measure: GenericMeasureType<number, MeasureStaticMethods> = createMeasureType(numericOps, staticMethods);
