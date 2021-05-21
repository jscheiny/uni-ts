import { getExponentValue } from "../exponent/exponentValueArithmetic";
import { defaultFormatUnit } from "./format";
import { GenericMeasure, MeasureFormatter, NumericOperations } from "./genericMeasure";
import {
    AllowedExponents,
    DivideUnits,
    DivisorUnit,
    ExponentiateUnit,
    MultiplicandUnit,
    MultiplyUnits,
    Unit,
    UnitWithSymbols,
} from "./unitTypeArithmetic";
import { divideUnits, exponentiateUnit, multiplyUnits } from "./unitValueArithmetic";

type GenericMeasureConstructor<N> = new <U extends Unit>(
    value: N,
    unit: UnitWithSymbols<U>,
    symbol?: string,
) => GenericMeasure<N, U>;

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

    class Measure<U extends Unit> implements GenericMeasure<N, U> {
        public readonly symbol: string | undefined;
        public squared!: "2" extends AllowedExponents<U> ? () => GenericMeasure<N, ExponentiateUnit<U, "2">> : never;
        public cubed!: "3" extends AllowedExponents<U> ? () => GenericMeasure<N, ExponentiateUnit<U, "3">> : never;

        constructor(public readonly value: N, public readonly unit: UnitWithSymbols<U>, symbol?: string) {
            this.symbol = symbol;
        }

        // Arithmetic

        public plus(other: GenericMeasure<N, U>): GenericMeasure<N, U> {
            return new Measure(num.add(this.value, other.value), this.unit);
        }

        public minus(other: GenericMeasure<N, U>): GenericMeasure<N, U> {
            return new Measure(num.sub(this.value, other.value), this.unit);
        }

        public negate(): GenericMeasure<N, U> {
            return new Measure(num.neg(this.value), this.unit);
        }

        public scale(value: N): GenericMeasure<N, U> {
            return new Measure(num.mult(this.value, value), this.unit);
        }

        public times<V extends MultiplicandUnit<U>>(
            other: GenericMeasure<N, V>,
        ): GenericMeasure<N, MultiplyUnits<U, V>> {
            // HACKHACK Need to cast as any to get around excessively deep type instantiation error
            return new Measure<any>(num.mult(this.value, other.value), multiplyUnits(this.unit, other.unit)) as any;
        }

        public over<V extends DivisorUnit<U>>(other: GenericMeasure<N, V>): GenericMeasure<N, DivideUnits<U, V>> {
            // HACKHACK Need to cast as any to get around excessively deep type instantiation error
            return new Measure<any>(num.div(this.value, other.value), divideUnits(this.unit, other.unit)) as any;
        }

        public per<V extends DivisorUnit<U>>(other: GenericMeasure<N, V>): GenericMeasure<N, DivideUnits<U, V>> {
            return this.over(other);
        }

        public div<V extends DivisorUnit<U>>(other: GenericMeasure<N, V>): GenericMeasure<N, DivideUnits<U, V>> {
            return this.over(other);
        }

        public toThe<E extends AllowedExponents<U>>(power: E): GenericMeasure<N, ExponentiateUnit<U, E>> {
            return new Measure(num.pow(this.value, getExponentValue(power)), exponentiateUnit(this.unit, power));
        }

        public inverse(): GenericMeasure<N, ExponentiateUnit<U, "-1">> {
            return this.toThe("-1");
        }

        public reciprocal(): GenericMeasure<N, ExponentiateUnit<U, "-1">> {
            return this.toThe("-1");
        }

        public unsafeMap<V extends Unit>(
            valueMap: (value: N) => N,
            unitMap?: (unit: UnitWithSymbols<U>) => UnitWithSymbols<V>,
        ): GenericMeasure<N, V> {
            const newUnit = unitMap === undefined ? this.unit : unitMap(this.unit);
            return new Measure<V>(valueMap(this.value), (newUnit as unknown) as UnitWithSymbols<V>);
        }

        // Comparisons

        public compare(other: GenericMeasure<N, U>): number {
            return num.compare(this.value, other.value);
        }

        public lt(other: GenericMeasure<N, U>): boolean {
            return this.compare(other) < 0;
        }

        public lte(other: GenericMeasure<N, U>): boolean {
            return this.compare(other) <= 0;
        }

        public eq(other: GenericMeasure<N, U>): boolean {
            return this.compare(other) === 0;
        }

        public neq(other: GenericMeasure<N, U>): boolean {
            return this.compare(other) !== 0;
        }

        public gte(other: GenericMeasure<N, U>): boolean {
            return this.compare(other) >= 0;
        }

        public gt(other: GenericMeasure<N, U>): boolean {
            return this.compare(other) > 0;
        }

        // Formatting

        public toString(formatter?: MeasureFormatter<N>): string {
            const { formatValue, formatUnit } = getFormatter(formatter);
            return `${formatValue(this.value)} ${formatUnit(this.unit)}`.trimRight();
        }

        public in(unit: GenericMeasure<N, U>, formatter?: MeasureFormatter<N>): string {
            if (unit.symbol === undefined) {
                return this.toString(formatter);
            }
            const { formatValue } = getFormatter(formatter);
            const value = formatValue(num.div(this.value, unit.value));
            return `${value} ${unit.symbol}`;
        }

        public valueIn(unit: GenericMeasure<N, U>): N {
            return this.over(unit).value;
        }

        public withSymbol(symbol: string | undefined): GenericMeasure<N, U> {
            return new Measure(this.value, this.unit, symbol);
        }

        public clone(): GenericMeasure<N, U> {
            return new Measure(this.value, this.unit);
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
