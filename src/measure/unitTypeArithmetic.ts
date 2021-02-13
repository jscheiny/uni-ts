import {
    AddendOf,
    AddExponents,
    DivideExponents,
    Exponent,
    MultiplicandOf,
    MultiplyExponents,
    PositiveExponent,
    ProductOf,
    SubtractExponents,
    SubtrahendOf,
} from "../exponent";

export type Unit<B extends {}> = { [D in keyof B]: Exponent };

export type DimensionlessUnit<B extends {}> = CleanUnit<{ [D in keyof B]: "0" }>;

export type DimensionUnit<B extends {}, D extends keyof B> = CleanUnit<{ [D2 in keyof B]: D extends D2 ? "1" : "0" }>;

// Multiplication

/** Returns the product of two units. This is the sum of two dimension vectors. */
export type MultiplyUnits<B extends {}, L extends Unit<B>, R extends Unit<B>> = CleanUnit<
    { [D in keyof B]: AddExponents<L[D], R[D]> }
>;

/** A type that is assignable from all units that can be multiplied by U without producing an error. */
export type MultiplicandUnit<B extends {}, U extends Unit<B>> = { [D in keyof B]: AddendOf<U[D]> };

// Division

/** Returns the quotient of two units. This is the difference of two dimension vectors. */
export type DivideUnits<B extends {}, L extends Unit<B>, R extends DivisorUnit<B, L>> = CleanUnit<
    { [D in keyof B]: SubtractExponents<L[D], R[D]> }
>;

/** A type that is assignable from all units that U can be divided by without producing an error. */
export type DivisorUnit<B extends {}, U extends Unit<B>> = { [D in keyof B]: SubtrahendOf<U[D]> };

// Exponentiation

/** Returns the unit raised to a power. This is the scalar multiple of the dimension vector. */
export type ExponentiateUnit<B extends {}, U extends Unit<B>, E extends Exponent> = CleanUnit<
    { [D in keyof B]: MultiplyExponents<U[D], E> }
>;

/** Returns the union of exponents to which a given unit is allowed to be raised.  */
export type AllowedExponents<B extends {}, U extends Unit<B>> =
    | Exclude<Exponent, NonAllowedExponents<B, U>>
    | "-1"
    | "0"
    | "1";

/** Returns the union of exponents that raising and exponent to would produce an error. */
type NonAllowedExponents<B extends {}, U extends Unit<B>> = {
    [D in keyof B]: Exclude<Exponent, MultiplicandOf<U[D]>>
}[keyof B];

// Roots

/** Returns the nth root of a unit. This is the inverse scalar multiple of the dimension vector. */
export type NthRootUnit<B extends {}, U extends Unit<B>, E extends Exponent> = CleanUnit<
    { [D in keyof B]: DivideExponents<U[D], E> }
>;

/** A type that is assignable from all units whose Nth root does not produce an error. */
export type RadicandUnit<B extends {}, N extends PositiveExponent> = { [D in keyof B]: ProductOf<N> };

// Utility types

/** Makes a unit pretty in intellisense views. */
type CleanUnit<U extends Unit<any>> = U extends any ? U : U;
