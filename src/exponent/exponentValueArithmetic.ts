import { Exponent } from "./generated/exponent";

export function getExponentValue(value: Exponent): number {
    return parseInt(value, 10);
}

export const negateExponent = (value: Exponent) => toExponent(-getExponentValue(value));
export const addExponents = wrapBinaryExponentFn((left, right) => left + right);
export const subtractExponents = wrapBinaryExponentFn((left, right) => left - right);
export const multiplyExponents = wrapBinaryExponentFn((left, right) => left * right);
export const divideExponents = wrapBinaryExponentFn((left, right) => left / right);

type BinaryExponentFn = (left: Exponent, right: Exponent) => Exponent;

function wrapBinaryExponentFn(fn: (left: number, right: number) => number): BinaryExponentFn {
    return (left, right) => toExponent(fn(getExponentValue(left), getExponentValue(right)));
}

function toExponent(value: number): Exponent {
    return `${value}` as Exponent;
}
