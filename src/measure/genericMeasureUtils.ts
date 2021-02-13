import { PositiveExponent } from "../exponent";
import { GenericMeasure } from "./genericMeasure";
import { NthRootUnit, RadicandUnit, Unit } from "./unitTypeArithmetic";
import { nthRootUnit } from "./unitValueArithmetic";

/** A function which applies a symbol prefix and multiplier to a given measure. */
export type PrefixFn<N = number> = {
    <B extends {}, U extends Unit<B>>(measure: GenericMeasure<N, B, U>): GenericMeasure<N, B, U>;
};

/** A function which transforms a single measure into another measure with the same unit. */
export type UnaryFn<N = number> = {
    <B extends {}, U extends Unit<B>>(x: GenericMeasure<N, B, U>): GenericMeasure<N, B, U>;
};

/** A function which takes the Rth root of a measure's value and unit. */
export type NthRootFn<E extends PositiveExponent, N = number> = {
    <B extends {}, U extends RadicandUnit<B, E>>(x: GenericMeasure<N, B, U>): GenericMeasure<
        N,
        B,
        NthRootUnit<B, U, E>
    >;
};

/** A function which transforms two measures with same unit into a single measure with the same unit. */
export type BinaryFn<N = number> = {
    <B extends {}, U extends Unit<B>>(left: GenericMeasure<N, B, U>, right: GenericMeasure<N, B, U>): GenericMeasure<
        N,
        B,
        U
    >;
};

/** A function which transforms one or more measure with the same unit into a single measure with the same unit. */
export type SpreadFn<N = number> = {
    <B extends {}, U extends Unit<B>>(
        first: GenericMeasure<N, B, U>,
        ...rest: Array<GenericMeasure<N, B, U>>
    ): GenericMeasure<N, B, U>;
};

/**
 * Converts a unary function of unitless numbers into a function of measures. This assumes that the underlying
 * operation makes no change to the unit of the measure. For example, this would be an incorrect usage:
 * `square = wrapUnaryFn((value: number) => value ** 2)` since squaring a measure would change its unit.
 * @param fn a unary function of numeric types
 * @returns a unary function of measures
 */
export function wrapUnaryFn<N>(fn: (x: N) => N): UnaryFn<N> {
    return x => x.unsafeMap(fn);
}

/**
 * Converts a function that takes the nth root of a number type (for a specific n) into a function of measures. The `n`
 * parameter must be a constant which matches the root that the function takes (e.g. 2 for square root, 3 for cube
 * root).
 * @param nthRoot a function that takes a specific root of a numeric type
 * @param n a compile time constant specifying which nth root the first parameter performs
 * @returns a function of measures which takes the nth root of the value and the unit.
 */
export function wrapRootFn<N, R extends PositiveExponent>(nthRoot: (x: N) => N, n: R): NthRootFn<R, N> {
    return x => x.unsafeMap(nthRoot, unit => nthRootUnit(x.unitSystem, unit, n));
}

/**
 * Converts a binary function of unitless numbers into a function of measures. This assumes that the underlying
 * operation makes no change to the unit of the measure. For example, this would be an incorrect usage:
 * `mult = wrapBinaryFn((left, right) => left * right)` since multiplying two measures would result in a different unit.
 * @param fn a binary function of numeric types
 * @returns a binary function of measures
 */
export function wrapBinaryFn<N>(fn: (left: N, right: N) => N): BinaryFn<N> {
    return (left, right) => left.unsafeMap(lValue => fn(lValue, right.value));
}

/**
 * Converts a function of any number of unitless numbers into a function of one or more measures. This assumes that the
 * underlying operation makes no change to the unit of the measure. For example, this would be an incorrect usage:
 * `product = wrapBinaryFn((...values) => product(values))` since multiplying measures would result in a different unit.
 * Note that the resulting function requires at least one value in order to compute the unit of the resulting measure.
 * @param fn a spread function of numeric types
 * @returns a spread function of measures
 */
export function wrapSpreadFn<N>(fn: (...x: N[]) => N): SpreadFn<N> {
    return (first, ...rest) => {
        const measureValues = [first, ...rest].map(m => m.value);
        const newValue = fn(...measureValues);
        return first.unsafeMap(() => newValue);
    };
}

/**
 * Converts a binary function of unitless numbers into a function of one or more measures by using that function as a
 * reducer for the measures. This assumes that the underlying operation makes no change to the unit of the measure. For
 * example this would be an incorrect usage: `product = wrapReducerFn((prev, curr) => prev * curr)` since multiplying
 * two measures would result in a different unit. Note that the resulting function requires at least one value in order
 * to compute the unit of the resulting measure.
 * @param fn a binary function of numeric types
 * @returns a spread function of measures that reduces its arguments using the binary function passed
 */
export function wrapReducerFn<N>(fn: (curr: N, prev: N, index: number) => N): SpreadFn<N> {
    return (first, ...rest) => {
        const values = rest.map(m => m.value);
        return first.unsafeMap(() => values.reduce(fn, first.value));
    };
}
