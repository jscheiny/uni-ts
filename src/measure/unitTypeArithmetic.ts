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

export type Unit = {
    [dimension: string]: Exponent | undefined;
};

export type UnitWithSymbols<U extends Unit = Unit> = { [D in keyof U]+?: [string, NonNullable<U[D]>] };
export type SymbolAndExponent = [string, Exponent];

// Multiplication

/** Returns the product of two units. This is the sum of two dimension vectors. */
export type MultiplyUnits<L extends Unit, R extends Unit> = CleanUnit<
    { [Dim in keyof L | keyof R]: AddExponents<GetExponent<L, Dim>, GetExponent<R, Dim>> }
>;

/** A type that is assignable from all units that can be multiplied by U without producing an error. */
export type MultiplicandUnit<U extends Unit> = Partial<{ [D in keyof U]: AddendOf<CleanExponent<U[D]>> }> & Unit;

// Division

/** Returns the quotient of two units. This is the difference of two dimension vectors. */
export type DivideUnits<L extends Unit, R extends DivisorUnit<L>> = CleanUnit<
    { [Dim in keyof L | keyof R]: SubtractExponents<GetExponent<L, Dim>, GetExponent<R, Dim>> }
>;

/** A type that is assignable from all units that U can be divided by without producing an error. */
export type DivisorUnit<U extends Unit> = 
    | U // unit can always be divided by itself, but typescript doesn't quite figure that out
    | Partial<{ [D in keyof U]: SubtrahendOf<CleanExponent<U[D]>> }> & Unit;

// Exponentiation

/** Returns the unit raised to a power. This is the scalar multiple of the dimension vector. */
export type ExponentiateUnit<U extends Unit, N extends Exponent> = "0" extends N
    ? {}
    : { [Dim in keyof U]: MultiplyExponents<GetExponent<U, Dim>, N> };

/** Returns the union of exponents to which a given unit is allowed to be raised.  */
export type AllowedExponents<U extends Unit> = Exclude<Exponent, NonAllowedExponents<U>> | "-1" | "0" | "1";

/** Returns the union of exponents that raising and exponent to would produce an error. */
type NonAllowedExponents<U extends Unit> = {
    [Dim in keyof U]: undefined extends U[Dim] ? never : Exclude<Exponent, MultiplicandOf<NonNullable<U[Dim]>>>
}[keyof U];

// Roots

/** Returns the nth root of a unit. This is the inverse scalar multiple of the dimension vector. */
export type NthRootUnit<U extends RadicandUnit<N>, N extends PositiveExponent> = 1 extends N
    ? U
    : { [Dim in keyof U]: DivideExponents<GetExponent<U, Dim>, N> };

/** A type that is assignable from all units whose Nth root does not produce an error. */
export type RadicandUnit<N extends PositiveExponent> = {
    [dimension: string]: ProductOf<N> | undefined;
};

// Utility types

/** Makes a unit pretty in intellisense views.  */
// `ExponentiateUnit<U, "1">` is a noop that seems to accomplish this but is slow to compile and we should see if
// there's a workaround.
type CleanUnit<U extends Unit> = ExponentiateUnit<StripZeroes<U>, "1">;

/** Removes all zero exponent dimensions from a dimension vector */
type StripZeroes<U extends Unit> = { [Dim in NonZeroKeys<U>]: U[Dim] };

/** Gets the union of all dimensions of a unit with non zero or null exponents */
type NonZeroKeys<U extends Unit> = { [Dim in keyof U]: NonNullable<U[Dim]> extends "0" ? never : Dim }[keyof U];

/** Get the exponent at a given dimension of a unit, or 0 if that dimension is undefined */
type GetExponent<U extends Unit, D> = D extends keyof U ? NonNullable<U[D]> : "0";

type CleanExponent<E extends undefined | Exponent> = undefined extends E ? "0" : NonNullable<E>;
