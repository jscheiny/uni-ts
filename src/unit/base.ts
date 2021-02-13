import { GenericMeasure } from "../measure/genericMeasure";
import { Measure } from "../measure/numberMeasure";
import { UnitBasis, UnitSystem } from "../measure/unitSystem";
import { DimensionUnit } from "../measure/unitTypeArithmetic";

export interface MetricSystem
    extends UnitBasis<
            | "length"
            | "mass"
            | "time"
            | "current"
            | "temperature"
            | "substance"
            | "intensity"
            | "planeAngle"
            | "solidAngle"
            | "memory"
        > {}

export const MetricSystem = new UnitSystem<MetricSystem>({
    length: "m",
    mass: "kg",
    time: "s",
    current: "A",
    temperature: "K",
    substance: "mol",
    intensity: "cd",
    planeAngle: "rad",
    solidAngle: "sr",
    memory: "b",
});

type MetricDimension<D extends keyof MetricSystem> = GenericMeasure<
    number,
    MetricSystem,
    DimensionUnit<MetricSystem, D>
>;

export const meters: MetricDimension<"length"> = Measure.dimension(MetricSystem, "length");
export const kilograms: MetricDimension<"mass"> = Measure.dimension(MetricSystem, "mass");
export const seconds: MetricDimension<"time"> = Measure.dimension(MetricSystem, "time");
export const amperes: MetricDimension<"current"> = Measure.dimension(MetricSystem, "current");
export const kelvin: MetricDimension<"temperature"> = Measure.dimension(MetricSystem, "temperature");
export const moles: MetricDimension<"substance"> = Measure.dimension(MetricSystem, "substance");
export const candelas: MetricDimension<"intensity"> = Measure.dimension(MetricSystem, "intensity");
export const radians: MetricDimension<"planeAngle"> = Measure.dimension(MetricSystem, "planeAngle");
export const steradians: MetricDimension<"solidAngle"> = Measure.dimension(MetricSystem, "solidAngle");
export const bits: MetricDimension<"memory"> = Measure.dimension(MetricSystem, "memory");
