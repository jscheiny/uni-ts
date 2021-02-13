import { getExponentValue } from "../exponent/exponentValueArithmetic";
import { defaultFormatUnit } from "./format";
import { ExpMethod, GenericMeasure, MeasureFormatter, NumericOperations } from "./genericMeasure";
import { UnitSystem } from "./unitSystem";
import {
    AllowedExponents,
    DivideUnits,
    DivisorUnit,
    ExponentiateUnit,
    MultiplicandUnit,
    MultiplyUnits,
    Unit,
} from "./unitTypeArithmetic";
import { divideUnits, exponentiateUnit, multiplyUnits } from "./unitValueArithmetic";

type GenericMeasureConstructor<N> = new <B extends {}, U extends Unit<B>>(
    value: N,
    unit: U,
    unitSystem: UnitSystem<B>,
    symbol?: string,
) => GenericMeasure<N, B, U>;

export function createMeasureClass<N>(num: NumericOperations<N>): GenericMeasureConstructor<N> {
    function getFormatter(formatter: MeasureFormatter<N> | undefined): Required<MeasureFormatter<N>> {
        if (formatter === undefined) {
            return {
                formatValue: num.format,
                formatUnit: defaultFormatUnit,
            };
        } else {
            return {
                formatValue: formatter.formatValue || num.format,
                formatUnit: formatter.formatUnit || defaultFormatUnit,
            };
        }
    }

    class Measure<B extends {}, U extends Unit<B>> implements GenericMeasure<N, B, U> {
        public squared!: ExpMethod<N, B, U, "2">;
        public cubed!: ExpMethod<N, B, U, "3">;

        constructor(
            public readonly value: N,
            public readonly unit: U,
            public readonly unitSystem: UnitSystem<B>,
            public readonly symbol?: string,
        ) {}

        // Arithmetic

        public plus(other: GenericMeasure<N, B, U>): GenericMeasure<N, B, U> {
            return new Measure(num.add(this.value, other.value), this.unit, this.unitSystem);
        }

        public minus(other: GenericMeasure<N, B, U>): GenericMeasure<N, B, U> {
            return new Measure(num.sub(this.value, other.value), this.unit, this.unitSystem);
        }

        public negate(): GenericMeasure<N, B, U> {
            return new Measure(num.neg(this.value), this.unit, this.unitSystem);
        }

        public scale(value: N): GenericMeasure<N, B, U> {
            return new Measure(num.mult(this.value, value), this.unit, this.unitSystem);
        }

        public times<V extends MultiplicandUnit<B, U>>(
            other: GenericMeasure<N, B, V>,
        ): GenericMeasure<N, B, MultiplyUnits<B, U, V>> {
            // HACKHACK Need to cast as any to get around excessively deep type instantiation error
            return new Measure(
                num.mult(this.value, other.value),
                multiplyUnits(this.unitSystem, this.unit, other.unit),
                this.unitSystem,
            ) as any;
        }

        public over<V extends DivisorUnit<B, U>>(
            other: GenericMeasure<N, B, V>,
        ): GenericMeasure<N, B, DivideUnits<B, U, V>> {
            // HACKHACK Need to cast as any to get around excessively deep type instantiation error
            return new Measure(
                num.div(this.value, other.value),
                divideUnits(this.unitSystem, this.unit, other.unit),
                this.unitSystem,
            ) as any;
        }

        public per<V extends DivisorUnit<B, U>>(
            other: GenericMeasure<N, B, V>,
        ): GenericMeasure<N, B, DivideUnits<B, U, V>> {
            return this.over(other);
        }

        public div<V extends DivisorUnit<B, U>>(
            other: GenericMeasure<N, B, V>,
        ): GenericMeasure<N, B, DivideUnits<B, U, V>> {
            return this.over(other);
        }

        public toThe<E extends AllowedExponents<B, U>>(power: E): GenericMeasure<N, B, ExponentiateUnit<B, U, E>> {
            // HACKHACK Need to cast as any to get around excessively deep type instantiation error
            return new Measure(
                num.pow(this.value, getExponentValue(power)),
                exponentiateUnit(this.unitSystem, this.unit, power),
                this.unitSystem,
            ) as any;
        }

        public inverse(): GenericMeasure<N, B, ExponentiateUnit<B, U, "-1">> {
            return this.toThe("-1");
        }

        public reciprocal(): GenericMeasure<N, B, ExponentiateUnit<B, U, "-1">> {
            return this.toThe("-1");
        }

        public unsafeMap<V extends Unit<B>>(
            valueMap: (value: N) => N,
            unitMap?: (unit: U) => V,
        ): GenericMeasure<N, B, V> {
            const newUnit = unitMap === undefined ? this.unit : unitMap(this.unit);
            return new Measure<B, V>(valueMap(this.value), newUnit as V, this.unitSystem);
        }

        // Comparisons

        public compare(other: GenericMeasure<N, B, U>): number {
            return num.compare(this.value, other.value);
        }

        public lt(other: GenericMeasure<N, B, U>): boolean {
            return this.compare(other) < 0;
        }

        public lte(other: GenericMeasure<N, B, U>): boolean {
            return this.compare(other) <= 0;
        }

        public eq(other: GenericMeasure<N, B, U>): boolean {
            return this.compare(other) === 0;
        }

        public neq(other: GenericMeasure<N, B, U>): boolean {
            return this.compare(other) !== 0;
        }

        public gte(other: GenericMeasure<N, B, U>): boolean {
            return this.compare(other) >= 0;
        }

        public gt(other: GenericMeasure<N, B, U>): boolean {
            return this.compare(other) > 0;
        }

        // Formatting

        public toString(formatter?: MeasureFormatter<N>): string {
            const { formatValue, formatUnit } = getFormatter(formatter);
            return `${formatValue(this.value)} ${formatUnit(this.unit, this.unitSystem)}`.trimRight();
        }

        public in(unit: GenericMeasure<N, B, U>, formatter?: MeasureFormatter<N>): string {
            if (unit.symbol === undefined) {
                return this.toString(formatter);
            }
            const { formatValue } = getFormatter(formatter);
            const value = formatValue(num.div(this.value, unit.value));
            return `${value} ${unit.symbol}`;
        }

        public withSymbol(symbol: string | undefined): GenericMeasure<N, B, U> {
            return new Measure(this.value, this.unit, this.unitSystem, symbol);
        }

        public clone(): GenericMeasure<N, B, U> {
            return new Measure(this.value, this.unit, this.unitSystem);
        }
    }

    Measure.prototype.squared = function(): any {
        return this.toThe("2");
    };

    Measure.prototype.cubed = function(): any {
        return this.toThe("3");
    };

    return Measure;
}
