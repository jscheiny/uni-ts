import { GenericMeasure } from "./genericMeasure";
import { BinaryFn, PrefixFn, SpreadFn } from "./genericMeasureUtils";
import {
    AllowedExponents,
    DivideUnits,
    DivisorUnit,
    ExponentiateUnit,
    MultiplicandUnit,
    MultiplyUnits,
    Unit,
} from "./unitTypeArithmetic";

export interface GenericMeasureStatic<N> {
    /** Sums a list of one or more measures, all of the same unit. */
    sum: SpreadFn<N>;

    /** Returns the smallest of a list of one or more measures. */
    min: SpreadFn<N>;

    /** Returns the largest of a list of one or more measures. */
    max: SpreadFn<N>;

    /** Static version of `left.plus(right)` */
    add: BinaryFn<N>;

    /** Static version of `left.minus(right)` */
    subtract: BinaryFn<N>;

    /** Static version of `left.times(right)` */
    multiply<B extends {}, L extends Unit<B>, R extends MultiplicandUnit<B, L>>(
        left: GenericMeasure<N, B, L>,
        right: GenericMeasure<N, B, R>,
    ): GenericMeasure<N, B, MultiplyUnits<B, L, R>>;

    /** Static version of `left.div(right)` */
    divide<B extends {}, L extends Unit<B>, R extends DivisorUnit<B, L>>(
        left: GenericMeasure<N, B, L>,
        right: GenericMeasure<N, B, R>,
    ): GenericMeasure<N, B, DivideUnits<B, L, R>>;

    /** Static version of `value.toThe(exp)` */
    pow<B extends {}, U extends Unit<B>, E extends AllowedExponents<B, U>>(
        value: GenericMeasure<N, B, U>,
        exp: E,
    ): GenericMeasure<N, B, ExponentiateUnit<B, U, E>>;

    /**
     * Creates a function that takes a measure and applies a symbol to its prefix and scales it by a given multiplier.
     * @param prefix the prefix to add to symbols of measures passed into the resulting function
     * @param multiplier the scalar by which to multiply measures passed into the resulting function
     * @returns a function that takes measures and adds a prefix to their symbols and multiplies them by a given value
     */
    prefix(prefix: string, multiplier: N): PrefixFn<N>;
}

export const getGenericMeasureStaticMethods = <N>(): GenericMeasureStatic<N> => ({
    sum: reduce((prev, curr) => prev.plus(curr)),
    min: reduce((min, curr) => (curr.lt(min) ? curr : min)),
    max: reduce((max, curr) => (curr.gt(max) ? curr : max)),
    add: (left, right) => left.plus(right),
    subtract: (left, right) => left.minus(right),
    multiply: (left, right) => left.times(right),
    divide: (left, right) => left.over(right),
    pow: (value, exp) => value.toThe(exp),
    prefix: (prefix, multiplier) => {
        return measure => {
            const { symbol } = measure;
            return measure.scale(multiplier).withSymbol(symbol && `${prefix}${symbol}`);
        };
    },
});

function reduce<N>(fn: BinaryFn<N>): SpreadFn<N> {
    return (first, ...rest) => rest.reduce(fn, first);
}
