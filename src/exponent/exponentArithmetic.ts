import { AddExponents } from "./generated/addition";
import { DivideExponents } from "./generated/division";
import { ArithmeticError, Exponent } from "./generated/exponent";
import { MultiplyExponents } from "./generated/multiplication";

export type NonZeroExponent = Exclude<Exponent, 0>;

export type SubtractExponents<L extends Exponent, R extends Exponent> = AddExponents<L, Negative<R>>;

/** Exponents that can be added to N without producing an error. */
export type AddendOf<N extends Exponent> = SubtractExponents<RemoveErrors<AddExponents<Exponent, N>>, N>;

/** Exponents that can be multiplied with N without producing an error. */
export type MultiplicandOf<N extends Exponent> = 0 extends N ? Exponent : DivideExponents<Exponent, ProductOf<N>>;

/** Exponents that are non-error multiples of N. */
export type ProductOf<N extends Exponent> = RemoveErrors<MultiplyExponents<Exponent, N>>;

type Negative<N extends Exponent> = MultiplyExponents<N, -1>;

type RemoveErrors<N extends Exponent | ArithmeticError> = Exclude<N, ArithmeticError>;
