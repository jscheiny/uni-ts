import { GenericMeasure, NumericOperations } from "./genericMeasure";
import { createMeasureClass } from "./genericMeasureClass";
import { GenericMeasureStatic, getGenericMeasureStaticMethods } from "./genericMeasureStatic";
import { UnitSystem } from "./unitSystem";
import { DimensionlessUnit, DimensionUnit, Unit } from "./unitTypeArithmetic";

/** The functions needed to construct a measure of a given numeric type */
interface GenericMeasureFactory<N> {
    /** The constructor for this generic measure type, useful for doing `instanceof` checks. */
    isMeasure(value: any): value is GenericMeasure<N, any, any>;

    /**
     * Creates a new dimension base unit.
     * @param unitSystem the unit system of the measure
     * @param dim one of the bases of the unit system
     * @returns A measure representing 1 base unit of the dimension (1 m)
     */
    dimension<B extends {}, D extends keyof B>(
        unitSystem: UnitSystem<B>,
        dim: D,
    ): GenericMeasure<N, B, DimensionUnit<B, D>>;

    /**
     * Creates a dimensionless measure.
     * @param unitSystem the unit system of the measure
     * @param value the value of the measure
     * @returns a measure with no dimensions
     */
    dimensionless<B extends {}>(unitSystem: UnitSystem<B>, value: N): GenericMeasure<N, B, DimensionlessUnit<B>>;

    /**
     * Creates a measure as a multiple of another measure.
     * @param value the number of measures
     * @param quantity the measure to be multiplied
     * @param symbol an optional unit symbol for this measure
     * @returns a measure of value number of quantities.
     */
    of<B extends {}, U extends Unit<B>>(
        value: N,
        quantity: GenericMeasure<N, B, U>,
        symbol?: string,
    ): GenericMeasure<N, B, U>;
}

type GenericMeasureCommon<N> = GenericMeasureFactory<N> & GenericMeasureStatic<N>;
type Omit<T, K extends string> = Pick<T, Exclude<keyof T, K>>;

/**
 * A complete measure type for a given numeric type. This consists of:
 * - Static methods to construct measures (e.g. `Measure.of`)
 * - Predefined arithmetic static methods (e.g. `Measure.add`)
 * - User defined static methods (e.g. `Measure.abs`)
 */
export type GenericMeasureType<N, StaticMethods extends {}> = GenericMeasureCommon<N> &
    Omit<StaticMethods, keyof GenericMeasureCommon<N>>;

/**
 * Creates a new measure factory for a given numeric type. The numeric type of the measure is inferred from the
 * parameter.
 * @param num the set of numeric operations needed to implement a measure for an arbitrary numeric type
 * @param staticMethods an object containing methods that should be spread into the static definition of a measure,
 * useful for attaching static math operations to the type.
 * @returns a factory for constructing measures of the given numeric type
 * @example
 * type MyMeasure<U extends Unit> = GenericMeasure<MyNumberType, U>;
 * const MyMeasure = createMeasureType({ ... });
 */
export function createMeasureType<N, S extends {} = {}>(
    num: NumericOperations<N>,
    staticMethods?: S,
): GenericMeasureType<N, S> {
    const Measure = createMeasureClass(num);

    const common: GenericMeasureCommon<N> = {
        ...getGenericMeasureStaticMethods(),
        isMeasure: (value): value is GenericMeasure<N, any, any> => {
            return value instanceof Measure;
        },
        dimensionless: (unitSystem, value) => {
            return new Measure(value, unitSystem.createDimensionlessUnit(), unitSystem);
        },
        dimension: (unitSystem, dim) => {
            const unit = unitSystem.createDimensionUnit(dim);
            const symbol = unitSystem.getSymbol(dim);
            return new Measure(num.one(), unit, unitSystem, symbol);
        },
        of: (value, quantity, symbol) => {
            const { unit, unitSystem } = quantity;
            return new Measure(num.mult(value, quantity.value), unit, unitSystem, symbol);
        },
    };

    return {
        ...((staticMethods || {}) as any),
        ...common,
    };
}
