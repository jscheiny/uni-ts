import { Measure } from "../measure";
import { Unit } from "../units";

describe("Measures", () => {
    const meter = Measure.dimension("m");
    const second = Measure.dimension("s");
    const mps = meter.per(second);
    const mps2 = mps.per(second);

    class TestMeasure<U extends Unit> extends Measure<Unit> {
        constructor(value: number, unit: U, symbol?: string | undefined) {
            super(value, unit, symbol);
        }
    }

    describe("construction", () => {
        it("should construct from a number of and a unit", () => {
            const measure = Measure.of(10, mps2);
            expect(measure.value).toBe(10);
            expect(measure.getUnit()).toEqual(mps2.getUnit());
        });

        it("should construct from a number and another measure", () => {
            const kilometer = Measure.of(1000, meter);
            const measure = Measure.of(5.2, kilometer);
            expect(measure.value).toBe(5200);
            expect(measure.getUnit()).toEqual(meter.getUnit());
        });

        it("should construct scalar values", () => {
            const scalar = Measure.scalar(3);
            expect(scalar.value).toBe(3);
            expect(scalar.getUnit()).toEqual({});
        });
    });

    describe("arithmetic", () => {
        it("should negate", () => {
            const value = Measure.of(10, mps);
            expect(value.negate()).toEqual(Measure.of(-10, mps));
        });

        it("should add", () => {
            const left = Measure.of(10, mps);
            const right = Measure.of(5, mps);
            expect(left.plus(right)).toEqual(Measure.of(15, mps));
        });

        it("should subtract", () => {
            const left = Measure.of(10, second);
            const right = Measure.of(5, second);
            expect(left.minus(right)).toEqual(Measure.of(5, second));
        });

        it("should multiply", () => {
            const left = Measure.of(10, mps);
            const right = Measure.of(5, second);
            expect(left.times(right)).toEqual(Measure.of(50, meter));
        });

        it("should divide", () => {
            const left = Measure.of(10, mps);
            const right = Measure.of(5, second);
            expect(left.over(right)).toEqual(Measure.of(2, mps2));
            expect(left.per(right)).toEqual(Measure.of(2, mps2));
        });

        it("should exponentiate", () => {
            const value = Measure.of(10, meter);

            expect(value.inverse()).toEqual(Measure.of(0.1, meter.inverse()));
            expect(value.reciprocal()).toEqual(Measure.of(0.1, meter.inverse()));
            expect(value.toThe(0)).toEqual(Measure.scalar(1));
            expect(value.toThe(1)).toEqual(Measure.of(10, meter));
            expect(value.squared()).toEqual(Measure.of(100, meter.squared()));
            expect(value.cubed()).toEqual(Measure.of(1000, meter.cubed()));
        });

        it("should square root", () => {
            const value = Measure.of(100, meter.squared());
            expect(value.sqrt()).toEqual(Measure.of(10, meter));
        });

        it("should cube root", () => {
            const value = Measure.of(64, mps.cubed());
            expect(value.cbrt()).toEqual(Measure.of(4, mps));
        });
    });

    describe("comparison", () => {
        const zero = Measure.of(0, meter);
        const five = Measure.of(5, meter);
        const ten = Measure.of(10, meter);

        it("should compare less than", () => {
            expect(five.isLessThan(zero)).toBe(false);
            expect(five.isLessThan(five)).toBe(false);
            expect(five.isLessThan(ten)).toBe(true);
        });

        it("should compare less than or equal to", () => {
            expect(five.isLessThanOrEqualTo(zero)).toBe(false);
            expect(five.isLessThanOrEqualTo(five)).toBe(true);
            expect(five.isLessThanOrEqualTo(ten)).toBe(true);
        });

        it("should compare equal to", () => {
            expect(five.isEqualTo(zero)).toBe(false);
            expect(five.isEqualTo(five)).toBe(true);
            expect(five.isEqualTo(ten)).toBe(false);
        });

        it("should compare not equal to", () => {
            expect(five.isNotEqualTo(zero)).toBe(true);
            expect(five.isNotEqualTo(five)).toBe(false);
            expect(five.isNotEqualTo(ten)).toBe(true);
        });

        it("should compare greater than or equal to", () => {
            expect(five.isGreaterThanOrEqualTo(zero)).toBe(true);
            expect(five.isGreaterThanOrEqualTo(five)).toBe(true);
            expect(five.isGreaterThanOrEqualTo(ten)).toBe(false);
        });

        it("should compare greater than", () => {
            expect(five.isGreaterThan(zero)).toBe(true);
            expect(five.isGreaterThan(five)).toBe(false);
            expect(five.isGreaterThan(ten)).toBe(false);
        });
    });

    describe("symbols", () => {
        it("should assign a symbol via .of()", () => {
            expect(Measure.of(1000, meter, "km").getSymbol()).toBe("km");
        });

        it("should copy assign a symbol via .withSymbol()", () => {
            const original = Measure.of(1000, meter);
            const result = original.withSymbol("km");
            expect(result).not.toBe(original);
            expect(original.getSymbol()).toBeUndefined();
            expect(result.getSymbol()).toBe("km");
        });

        it("should not pass along symbols through operations", () => {
            const km = Measure.of(1000, meter.squared()).withSymbol("km2");
            const dm = Measure.of(10, meter.squared()).withSymbol("dm2");
            expect(km.normalized().getSymbol()).toBeUndefined();
            expect(km.negate().getSymbol()).toBeUndefined();
            expect(km.squared().getSymbol()).toBeUndefined();
            expect(km.sqrt().getSymbol()).toBeUndefined();
            expect(km.inverse().getSymbol()).toBeUndefined();
            expect(km.plus(dm).getSymbol()).toBeUndefined();
            expect(km.minus(dm).getSymbol()).toBeUndefined();
            expect(km.times(dm).getSymbol()).toBeUndefined();
            expect(km.over(dm).getSymbol()).toBeUndefined();
        });
    });

    describe("formatting", () => {
        it("should format scalar units", () => {
            expect(Measure.scalar(10).toString()).toBe("10 scalar");
            expect(new TestMeasure(10, { x: 0, y: undefined }).toString()).toBe("10 scalar");
        });

        it("should format base units", () => {
            expect(meter.toString()).toBe("1 m");
            expect(Measure.of(5.3, meter).toString()).toBe("5.3 m");
        });

        it("should format complex units", () => {
            expect(Measure.of(5, meter.squared()).toString()).toBe("5 m^2");
            expect(Measure.of(5, second.inverse()).toString()).toBe("5 s^-1");
            expect(Measure.of(5, meter.times(second)).toString()).toBe("5 m * s");
            expect(Measure.of(5, meter.over(second)).toString()).toBe("5 m * s^-1");
            expect(Measure.of(5, meter.cubed().over(second)).toString()).toBe("5 m^3 * s^-1");
            expect(Measure.of(5, meter.cubed().over(second.squared())).toString()).toBe("5 m^3 * s^-2");
        });

        it("should not format using symbol even if present", () => {
            expect(
                Measure.of(5, meter.squared())
                    .withSymbol("m2")
                    .toString(),
            ).toBe("5 m^2");
            expect(
                Measure.scalar(0)
                    .withSymbol("rad")
                    .toString(),
            ).toBe("0 scalar");
        });

        it("should skip formatting explicitly 0 and undefined dimension", () => {
            expect(new TestMeasure(10, { x: 0, y: undefined, z: 2 }).toString()).toBe("10 z^2");
        });

        it("should format measures as other measures with symbols", () => {
            const glorbs = Measure.of(100, meter, "glb");
            expect(Measure.of(1000, meter).in(glorbs)).toBe("10 glb");
        });

        it("should use normal formatting if the other measure has no symbol", () => {
            const glorbs = Measure.of(100, meter);
            expect(Measure.of(1000, meter).in(glorbs)).toBe("1000 m");
        });
    });
});
