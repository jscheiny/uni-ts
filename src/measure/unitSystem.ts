import { Exponent } from "../exponent";
import { DimensionlessUnit, DimensionUnit, Unit } from "./unitTypeArithmetic";

/**
 * A convenience type to define the dimensions of a unit system. To make improve intellisense views for all safe-units
 * types, make sure to extend an empty interface from this type.
 * @example
 * interface MetricSystem extends UnitBasis<"length" | "time" | "mass" | ... > {}
 */
export type UnitBasis<K extends string> = Record<K, unknown>;

type SymbolMap<B> = Record<keyof B, string>;

/**
 * A unit system consists of a set of dimensions and corresponding base units. The base dimensions for a unit system
 * are defined by the keys of the B type parameter. The base units are given by the symbol map passed into the
 * constructor.
 */
export class UnitSystem<B extends {}> {
    private readonly dimensions: Array<keyof B>;

    /**
     * Constructs a unit system given a map from dimension to the symbol for the base unit of that dimension. To
     * improve intellisense views for all safe-units types, make sure to pass an interface as a type argument to this
     * constructor.
     * @param symbols a map from dimension to the unit symbol for the base unit of that dimension.
     * @example
     * interface MetricSystem extends UnitBasis<"length" | "time" | "mass" | ... > {}
     * // We pass the type parameter below even though it could be inferred.
     * const MetricSystem = new UnitSystem<MetricSystem>({
     *     length: "m",
     *     mass: "kg",
     *     time: "s",
     *     ...
     * });
     */
    constructor(private readonly symbols: SymbolMap<B>) {
        this.dimensions = Object.keys(symbols) as Array<keyof B>;
    }

    /** @returns the list of dimension names for this unit system. */
    public getDimensions(): ReadonlyArray<keyof B> {
        return this.dimensions;
    }

    /** @returns the symbol of the base unit of a given dimension. */
    public getSymbol(dimension: keyof B): string {
        return this.symbols[dimension];
    }

    /** @returns a unit representing a dimensionless value, all dimensions having an exponent of 0. */
    public createDimensionlessUnit(): DimensionlessUnit<B> {
        return this.createUnit(() => "0") as DimensionlessUnit<B>;
    }

    /** @returns a unit representing a given dimension, only that dimension having an exponent of 1. */
    public createDimensionUnit<D extends keyof B>(dimension: D): DimensionUnit<B, D> {
        return this.createUnit(dim => (dim === dimension ? "1" : "0")) as DimensionUnit<B, D>;
    }

    /**
     * Creates a unit by mapping each dimension of the unit system to a given exponent defined by a mapping function.
     * @param getExponent a function which maps a given dimension of the unit system to the exponent of the resulting
     * unit.
     */
    public createUnit(getExponent: (dimension: keyof B) => Exponent): Unit<B> {
        const partial: Partial<Unit<B>> = {};

        for (const dimension of this.dimensions) {
            partial[dimension] = getExponent(dimension);
        }

        return partial as Unit<B>;
    }
}
