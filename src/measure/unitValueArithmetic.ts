import { Exponent, NonZeroExponent } from "../exponent";
import {
    BaseUnit,
    DivideUnits,
    ExponentiateUnit,
    MultiplyUnits,
    NthRootUnit,
    RadicandUnit,
    SymbolAndExponent,
    Unit,
    UnitWithSymbols,
} from "./unitTypeArithmetic";

export function dimension<Dim extends string>(dim: Dim, symbol?: string): UnitWithSymbols<{ [D in Dim]: 1 }> {
    return { [dim]: [symbol || dim, 1] } as any;
}

export function multiplyUnits<L extends Unit, R extends Unit>(
    left: UnitWithSymbols<L>,
    right: UnitWithSymbols<R>,
): UnitWithSymbols<MultiplyUnits<L, R>> {
    const result: UnitWithSymbols = {};
    for (const dimension in left) {
        const symbolAndExponent = copySymbolAndExponent(left, dimension);
        if (symbolAndExponent !== undefined && symbolAndExponent[1] !== 0) {
            result[dimension] = symbolAndExponent;
        }
    }
    for (const dimension in right) {
        const symbolAndExponent = copySymbolAndExponent(right, dimension);
        if (symbolAndExponent === undefined) {
            continue;
        }
        const [, exponent] = symbolAndExponent;
        const resultValue: SymbolAndExponent | undefined = result[dimension];
        if (resultValue !== undefined) {
            const newExponent = (resultValue[1] + exponent) as Exponent;
            if (newExponent === 0) {
                delete result[dimension];
            } else {
                resultValue[1] = newExponent;
            }
        } else if (exponent !== 0) {
            result[dimension] = symbolAndExponent;
        }
    }
    return result as any;
}

function copySymbolAndExponent(unit: UnitWithSymbols, dimension: string): SymbolAndExponent | undefined {
    const result = unit[dimension];
    if (result === undefined) {
        return undefined;
    }
    const [symbol, exponent] = result;
    return [symbol, exponent];
}

export function divideUnits<L extends Unit, R extends Unit>(
    left: UnitWithSymbols<L>,
    right: UnitWithSymbols<R>,
): UnitWithSymbols<DivideUnits<L, R>> {
    return multiplyUnits(left, exponentiateUnit(right, -1)) as any;
}

export function exponentiateUnit<U extends BaseUnit<N>, N extends Exponent>(
    unit: UnitWithSymbols<U>,
    power: N,
): UnitWithSymbols<ExponentiateUnit<U, N>> {
    return expAndRootImpl(unit, exponent => exponent * power);
}

export function nthRootUnit<U extends RadicandUnit<N>, N extends NonZeroExponent>(
    unit: UnitWithSymbols<U>,
    root: N,
): UnitWithSymbols<NthRootUnit<U, N>> {
    return expAndRootImpl(unit, exponent => exponent / root);
}

export function sqrtUnit<U extends RadicandUnit<2>>(unit: UnitWithSymbols<U>): UnitWithSymbols<NthRootUnit<U, 2>> {
    return nthRootUnit(unit, 2);
}

export function cbrtUnit<U extends RadicandUnit<3>>(unit: UnitWithSymbols<U>): UnitWithSymbols<NthRootUnit<U, 3>> {
    return nthRootUnit(unit, 3);
}

function expAndRootImpl(unit: UnitWithSymbols, updateExponent: (exp: Exponent) => number): any {
    const result: UnitWithSymbols = {};
    for (const dimension in unit) {
        const symbolAndExponent = unit[dimension];
        if (symbolAndExponent === undefined) {
            continue;
        }
        const [symbol, exponent] = symbolAndExponent;
        const newExponent = updateExponent(exponent) as Exponent;
        if (newExponent !== 0) {
            result[dimension] = [symbol, newExponent];
        }
    }
    return result;
}
