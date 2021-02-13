import { Exponent, PositiveExponent } from "../exponent";
import {
    addExponents,
    divideExponents,
    multiplyExponents,
    subtractExponents,
} from "../exponent/exponentValueArithmetic";
import { UnitSystem } from "./unitSystem";
import { NthRootUnit, RadicandUnit, Unit } from "./unitTypeArithmetic";

export function multiplyUnits<B extends {}>(unitSystem: UnitSystem<B>, left: Unit<B>, right: Unit<B>): Unit<B> {
    return unitSystem.createUnit(dimension => addExponents(left[dimension], right[dimension]));
}

export function divideUnits<B extends {}>(unitSystem: UnitSystem<B>, left: Unit<B>, right: Unit<B>): Unit<B> {
    return unitSystem.createUnit(dimension => subtractExponents(left[dimension], right[dimension]));
}

export function exponentiateUnit<B extends {}>(unitSystem: UnitSystem<B>, unit: Unit<B>, power: Exponent): Unit<B> {
    return unitSystem.createUnit(dimension => multiplyExponents(unit[dimension], power));
}

export function nthRootUnit<B extends {}, U extends RadicandUnit<B, E>, E extends PositiveExponent>(
    unitSystem: UnitSystem<B>,
    unit: U,
    root: E,
): NthRootUnit<B, U, E> {
    return unitSystem.createUnit(dimension => divideExponents(unit[dimension], root)) as NthRootUnit<B, U, E>;
}
