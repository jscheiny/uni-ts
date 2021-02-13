import { Exponent } from "../exponent";
import { getExponentValue, negateExponent } from "../exponent/exponentValueArithmetic";
import { UnitSystem } from "./unitSystem";
import { Unit } from "./unitTypeArithmetic";

interface UnitDimension {
    symbol: string;
    exponent: Exponent;
}

export function defaultFormatUnit<B extends {}>(unit: Unit<B>, unitSystem: UnitSystem<B>): string {
    const dimensions = getDimensions(unit, unitSystem).sort(orderDimensions);

    if (dimensions.length === 0) {
        return "";
    }

    const positive = dimensions.filter(({ exponent }) => getExponentValue(exponent) > 0);
    const negative = dimensions.filter(({ exponent }) => getExponentValue(exponent) < 0);

    if (positive.length === 0) {
        return formatDimensions(negative);
    }

    const numerator = formatDimensions(positive);
    if (negative.length === 0) {
        return numerator;
    }

    const denominator = formatDimensions(negative.map(negateDimension));
    return `${numerator} / ${maybeParenthesize(denominator, negative.length !== 1)}`;
}

function orderDimensions(left: UnitDimension, right: UnitDimension): number {
    return left.symbol < right.symbol ? -1 : 1;
}

function formatDimensions(dimensions: UnitDimension[]): string {
    return dimensions
        .map(({ symbol, exponent }) => {
            const exponentStr = exponent !== "1" ? `^${exponent}` : "";
            return `${symbol}${exponentStr}`;
        })
        .join(" * ");
}

function negateDimension({ symbol, exponent }: UnitDimension): UnitDimension {
    return { symbol, exponent: negateExponent(exponent) };
}

function maybeParenthesize(text: string, parenthesize: boolean): string {
    return parenthesize ? `(${text})` : text;
}

function getDimensions<B extends {}>(unit: Unit<B>, unitSystem: UnitSystem<B>): UnitDimension[] {
    return unitSystem
        .getDimensions()
        .map((dimension): UnitDimension => ({
            symbol: unitSystem.getSymbol(dimension),
            exponent: unit[dimension],
        }))
        .filter(({ exponent }) => exponent !== "0");
}
