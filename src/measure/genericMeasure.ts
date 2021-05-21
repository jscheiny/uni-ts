import {
    AllowedExponents,
    DivideUnits,
    DivisorUnit,
    ExponentiateUnit,
    MultiplicandUnit,
    MultiplyUnits,
    Unit,
    UnitWithSymbols,
} from "./unitTypeArithmetic";

export interface MeasureFormatter<N> {
    formatValue?: (value: N) => string;
    formatUnit?: (unit: UnitWithSymbols) => string;
}

/** The set of numeric operations required to fully represent a `GenericMeasure` for a given numeric type */
export interface NumericOperations<N> {
    /** Returns the multiplicative identity for numbers of type N */
    one(): N;
    /** Returns the negative of a number of type N */
    neg(value: N): N;
    /** Returns the sum of two numbers of type N */
    add(left: N, right: N): N;
    /** Returns the difference of two numbers of type N */
    sub(left: N, right: N): N;
    /** Returns the product of two numbers of type N */
    mult(left: N, right: N): N;
    /** Returns the quotient of two numbers of type N */
    div(left: N, right: N): N;
    /** Returns the base raised to the exponent for numbers of type N */
    pow(base: N, exponent: number): N;
    /** Compares two numbers returning a negative, zero, or positive value. */
    compare(left: N, right: N): number;
    /** Formats a number for display */
    format(value: N): string;
}

/** A numeric value with a corresponding unit of measurement. */
export interface GenericMeasure<N, U extends Unit> {
    /** The numeric value of this measure */
    readonly value: N;
    /** The unit of this measure */
    readonly unit: UnitWithSymbols<U>;
    /** The symbol of the unit this measure represents (e.g. 0.3048 m = 1 ft) */
    readonly symbol: string | undefined;

    /**
     * If this measure can be squared, squares it. If this measure is not squarable (due to exponent limitations), then
     * this function will have type `never`.
     * @returns this measure multiplied by itself
     */
    squared: "2" extends AllowedExponents<U> ? () => GenericMeasure<N, ExponentiateUnit<U, "2">> : never;

    /**
     * If this measure can be cubed, cubes it. If this measure cannot be cubed (due to exponent limitations), then
     * this function will have type `never`.
     * @returns this cube of this measure
     */
    cubed: "3" extends AllowedExponents<U> ? () => GenericMeasure<N, ExponentiateUnit<U, "3">> : never;

    /**
     * Raises this measure to a given power. If the result would give exponents outside of the allowable bounds, this
     * will return `never`.
     * @param exponent the exponent to raise this measure to
     * @returns this exponent to the given power
     */
    toThe<E extends AllowedExponents<U>>(exponent: E): GenericMeasure<N, ExponentiateUnit<U, E>>;

    /**
     * Adds this measure to another measure with the same unit.
     * @param other the value to add
     * @returns the sum
     */
    plus(other: GenericMeasure<N, U>): GenericMeasure<N, U>;

    /**
     * Subtracts another measure with the same unit from this measure.
     * @param other the value to subtract
     * @returns the difference
     */
    minus(other: GenericMeasure<N, U>): GenericMeasure<N, U>;

    /**
     * Negates the value of this measure.
     * @returns A measure whose value is the negative of this measure
     */
    negate(): GenericMeasure<N, U>;

    /**
     * Multiplies this measure by a dimensionless value.
     * @param value a scalar dimensionless value by which to scale this measure
     * @returns A measure scaled by the value
     */
    scale(value: N): GenericMeasure<N, U>;

    /**
     * Multiplies this measure with another measure.
     * @param other the value to multiply
     * @returns the product measure with a unit thats the product of the units
     */
    times<V extends MultiplicandUnit<U>>(other: GenericMeasure<N, V>): GenericMeasure<N, MultiplyUnits<U, V>>;

    /**
     * Divides this measure by another measure.
     * @param other the divisor
     * @returns the quotient measure with a unit thats the quotient of the units
     */
    over<V extends DivisorUnit<U>>(other: GenericMeasure<N, V>): GenericMeasure<N, DivideUnits<U, V>>;

    /**
     * Divides this measure by another measure.
     * @param other the divisor
     * @returns the quotient measure with a unit thats the quotient of the units
     */
    per<V extends DivisorUnit<U>>(other: GenericMeasure<N, V>): GenericMeasure<N, DivideUnits<U, V>>;

    /**
     * Divides this measure by another measure.
     * @param other the divisor
     * @returns the quotient measure with a unit thats the quotient of the units
     */
    div<V extends DivisorUnit<U>>(other: GenericMeasure<N, V>): GenericMeasure<N, DivideUnits<U, V>>;

    /**
     * Returns the reciprocal of this measure.
     * @returns the reciprocal of this measure with a recriprocal unit
     */
    inverse(): GenericMeasure<N, ExponentiateUnit<U, "-1">>;

    /**
     * Returns the reciprocal of this measure.
     * @returns the reciprocal of this measure with a recriprocal unit
     */
    reciprocal(): GenericMeasure<N, ExponentiateUnit<U, "-1">>;

    /**
     * Maps the value and possibly unit of this measure.
     * @param valueMap a mapping on the value of the measure
     * @param unitMap an optional mapping on the unit of the measure
     * @returns a new measure whose value and unit have been mapped
     */
    unsafeMap(fn: (value: N) => N): GenericMeasure<N, U>;
    unsafeMap<V extends Unit>(
        valueMap: (value: N) => N,
        unitMap: (unit: UnitWithSymbols<U>) => UnitWithSymbols<V>,
    ): GenericMeasure<N, V>;

    /**
     * Compares two measures to each other. Returns a negative value if this < other, a postive value if this > other
     * and 0 if the two are equal.
     * @param another measure with the same unit
     * @returns a value indicating how the value of this measure compares to the value of the other measure
     */
    compare(other: GenericMeasure<N, U>): number;

    /**
     * @param another measure with the same unit
     * @returns true if the value of this measure is less than the value of the other measure
     */
    lt(other: GenericMeasure<N, U>): boolean;

    /**
     * @param another measure with the same unit
     * @returns true if the value of this measure is less than or equal to the value of the other measure
     */
    lte(other: GenericMeasure<N, U>): boolean;

    /**
     * @param another measure with the same unit
     * @returns true if the value of this measure is equal to the value of the other measure
     */
    eq(other: GenericMeasure<N, U>): boolean;

    /**
     * @param another measure with the same unit
     * @returns true if the value of this measure is not equal to the value of the other measure
     */
    neq(other: GenericMeasure<N, U>): boolean;

    /**
     * @param another measure with the same unit
     * @returns true if the value of this measure is greater than or equal to the value of the other measure
     */
    gte(other: GenericMeasure<N, U>): boolean;

    /**
     * @param another measure with the same unit
     * @returns true if the value of this measure is greater than the value of the other measure
     */
    gt(other: GenericMeasure<N, U>): boolean;

    /**
     * Formats the value and the unit.
     * @returns a string representation of measure
     */
    toString(formatter?: MeasureFormatter<N>): string;

    /**
     * Formats this measure as a product of another unit. If the given unit has a symbol, this will format as a number
     * followed by that symbol. If not, this is equivalent to calling `toString()`.
     * @param a unit to be used to represent this measure
     * @returns a string representation of measure
     */
    in(unit: GenericMeasure<N, U>, formatter?: MeasureFormatter<N>): string;

    /**
     * Converts this measure to another unit, e.g. for passing to an external API that requires pure numbers of particular unit.
     * @param unit the unit to convert to
     * @returns the numeric value of this measure in the given unit
     */
    valueIn(unit: GenericMeasure<N, U>): N;

    /**
     * Adds a symbol to this measure.
     * @param symbol the symbol of the unit represented by this measure
     */
    withSymbol(symbol: string | undefined): GenericMeasure<N, U>;

    /** Shallow copies this measure instance. */
    clone(): GenericMeasure<N, U>;
}

/**
 * Translates a measure type from one numeric type to another while preserving the unit.
 * @example
 * const metersPerSecond = meters.per(seconds);
 * type Velocity<N> = LiftMeasure<typeof metersPerSecond, N>;
 */
export type LiftMeasure<M extends GenericMeasure<any, any>, N> = M extends GenericMeasure<any, infer U>
    ? GenericMeasure<N, U>
    : never;
