import { MeasureFormatter } from "../genericMeasure";
import { Measure } from "../numberMeasure";
import { UnitBasis, UnitSystem } from "../unitSystem";

describe("Number measures", () => {
    interface TestUnitSystem extends UnitBasis<"length" | "time" | "mass"> {}

    const TestUnitSystem = new UnitSystem<TestUnitSystem>({
        length: "m",
        time: "s",
        mass: "kg",
    });

    const meters = Measure.dimension(TestUnitSystem, "length");
    const seconds = Measure.dimension(TestUnitSystem, "time");
    const kilograms = Measure.dimension(TestUnitSystem, "mass");
    const mps = meters.per(seconds);
    const mps2 = mps.per(seconds);

    describe("dimension", () => {
        it("should create dimensions with value 1", () => {
            expect(meters).toEqual({
                value: 1,
                unit: { length: "1", time: "0", mass: "0" },
                unitSystem: TestUnitSystem,
                symbol: "m",
            });
        });
    });

    describe("construction", () => {
        it("should construct from a number of and a unit", () => {
            const measure = Measure.of(10, mps2);
            expect(measure.value).toBe(10);
            expect(measure.unit).toEqual(mps2.unit);
        });

        it("should construct from a number and another measure", () => {
            const kilometer = Measure.of(1000, meters);
            const measure = Measure.of(5.2, kilometer);
            expect(measure.value).toBe(5200);
            expect(measure.unit).toEqual(meters.unit);
        });

        it("should construct dimensionless values", () => {
            const dimensionless = Measure.dimensionless(TestUnitSystem, 3);
            expect(dimensionless.value).toBe(3);
            expect(dimensionless.unit).toEqual({ length: "0", time: "0", mass: "0" });
        });
    });

    describe("prefixes", () => {
        const kilo = Measure.prefix("k", 1000);

        it("should scale the base unit", () => {
            const km = kilo(meters);
            expect(km.unit).toEqual(meters.unit);
            expect(km.value).toBe(1000);
        });

        it("should apply a prefix when a symbol is present on the base unit", () => {
            expect(kilo(meters).symbol).toBe("km");
        });

        it("should not apply a prefix when a symbol is not present on the base unit", () => {
            const blargs = Measure.of(1e-3, meters);
            const kblargs = kilo(blargs);
            expect(kblargs.symbol).toBeUndefined();
            expect(kblargs.value).toBe(1);
        });
    });

    describe("math", () => {
        it("arithmetic", () => {
            expect(Measure.add(Measure.of(5, mps), Measure.of(-5, mps))).toEqual(Measure.of(0, mps));
            expect(Measure.subtract(Measure.of(5, mps), Measure.of(-5, mps))).toEqual(Measure.of(10, mps));
            expect(Measure.multiply(Measure.of(5, mps), Measure.of(10, seconds))).toEqual(Measure.of(50, meters));
            expect(Measure.divide(Measure.of(50, meters), Measure.of(10, seconds))).toEqual(Measure.of(5, mps));
        });

        it("abs", () => {
            expect(Measure.abs(Measure.of(-10, mps))).toEqual(Measure.of(10, mps));
        });

        it("cbrt", () => {
            expect(Measure.cbrt(Measure.of(64, seconds.cubed()))).toEqual(Measure.of(4, seconds));
        });

        it("ceil", () => {
            expect(Measure.ceil(Measure.of(3.4, mps))).toEqual(Measure.of(4, mps));
        });

        it("floor", () => {
            expect(Measure.floor(Measure.of(7.8, mps))).toEqual(Measure.of(7, mps));
        });

        it("hypot", () => {
            expect(Measure.hypot(Measure.of(3, meters), Measure.of(4, meters))).toEqual(Measure.of(5, meters));
        });

        it("max", () => {
            expect(Measure.max(Measure.of(10, mps), Measure.of(5, mps), Measure.of(15, mps))).toEqual(
                Measure.of(15, mps),
            );
        });

        it("min", () => {
            expect(Measure.min(Measure.of(10, mps), Measure.of(5, mps), Measure.of(15, mps))).toEqual(
                Measure.of(5, mps),
            );
        });

        it("pow", () => {
            expect(Measure.pow(Measure.of(3, meters), "4")).toEqual(Measure.of(81, meters.toThe("4")));
        });

        it("round", () => {
            expect(Measure.round(Measure.of(7.8, mps))).toEqual(Measure.of(8, mps));
        });

        it("sqrt", () => {
            expect(Measure.sqrt(Measure.of(25, meters.squared()))).toEqual(Measure.of(5, meters));
        });

        it("sum", () => {
            expect(Measure.sum(Measure.of(10, mps), Measure.of(5, mps), Measure.of(15, mps))).toEqual(
                Measure.of(30, mps),
            );
        });

        it("trunc", () => {
            expect(Measure.trunc(Measure.of(-7.8, mps))).toEqual(Measure.of(-7, mps));
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
            const left = Measure.of(10, seconds);
            const right = Measure.of(5, seconds);
            expect(left.minus(right)).toEqual(Measure.of(5, seconds));
        });

        it("should multiply", () => {
            const left = Measure.of(10, mps);
            const right = Measure.of(5, seconds);
            expect(left.times(right)).toEqual(Measure.of(50, meters));
        });

        it("should divide", () => {
            const left = Measure.of(10, mps);
            const right = Measure.of(5, seconds);
            expect(left.over(right)).toEqual(Measure.of(2, mps2));
            expect(left.per(right)).toEqual(Measure.of(2, mps2));
            expect(left.div(right)).toEqual(Measure.of(2, mps2));
        });

        it("should scale", () => {
            const value = Measure.of(10, mps);
            expect(value.scale(2)).toEqual(Measure.of(20, mps));
        });

        it("should exponentiate", () => {
            const value = Measure.of(10, meters);

            expect(value.inverse()).toEqual(Measure.of(0.1, meters.inverse()));
            expect(value.reciprocal()).toEqual(Measure.of(0.1, meters.inverse()));
            expect(value.toThe("0")).toEqual(Measure.dimensionless(TestUnitSystem, 1));
            expect(value.toThe("1")).toEqual(Measure.of(10, meters));
            expect(value.squared()).toEqual(Measure.of(100, meters.squared()));
            expect(value.cubed()).toEqual(Measure.of(1000, meters.cubed()));
        });
    });

    describe("comparison", () => {
        const zero = Measure.of(0, meters);
        const five = Measure.of(5, meters);
        const ten = Measure.of(10, meters);

        it("should compare less than", () => {
            expect(five.lt(zero)).toBe(false);
            expect(five.lt(five)).toBe(false);
            expect(five.lt(ten)).toBe(true);
        });

        it("should compare less than or equal to", () => {
            expect(five.lte(zero)).toBe(false);
            expect(five.lte(five)).toBe(true);
            expect(five.lte(ten)).toBe(true);
        });

        it("should compare equal to", () => {
            expect(five.eq(zero)).toBe(false);
            expect(five.eq(five)).toBe(true);
            expect(five.eq(ten)).toBe(false);
        });

        it("should compare not equal to", () => {
            expect(five.neq(zero)).toBe(true);
            expect(five.neq(five)).toBe(false);
            expect(five.neq(ten)).toBe(true);
        });

        it("should compare greater than or equal to", () => {
            expect(five.gte(zero)).toBe(true);
            expect(five.gte(five)).toBe(true);
            expect(five.gte(ten)).toBe(false);
        });

        it("should compare greater than", () => {
            expect(five.gt(zero)).toBe(true);
            expect(five.gt(five)).toBe(false);
            expect(five.gt(ten)).toBe(false);
        });
    });

    describe("symbols", () => {
        it("should assign a symbol via .of()", () => {
            expect(Measure.of(1000, meters, "km").symbol).toBe("km");
        });

        it("should copy assign a symbol via .withSymbol()", () => {
            const original = Measure.of(1000, meters);
            const result = original.withSymbol("km");
            expect(result).not.toBe(original);
            expect(original.symbol).toBeUndefined();
            expect(result.symbol).toBe("km");
        });

        it("should not pass along symbols through operations", () => {
            const km = Measure.of(1000, meters.squared()).withSymbol("km2");
            const dm = Measure.of(10, meters.squared()).withSymbol("dm2");
            expect(km.negate().symbol).toBeUndefined();
            expect(km.squared().symbol).toBeUndefined();
            expect(km.inverse().symbol).toBeUndefined();
            expect(km.plus(dm).symbol).toBeUndefined();
            expect(km.minus(dm).symbol).toBeUndefined();
            expect(km.times(dm).symbol).toBeUndefined();
            expect(km.over(dm).symbol).toBeUndefined();
        });
    });

    describe("formatting", () => {
        function expectFormat(unit: Measure<any, any>, formatted: string, formatter?: MeasureFormatter<number>): void {
            expect(unit.toString(formatter)).toBe(formatted);
        }

        it("should format dimensionless units", () => {
            expectFormat(Measure.dimensionless(TestUnitSystem, 10), "10");
        });

        it("should format base units", () => {
            expectFormat(meters, "1 m");
        });

        it("should format units with only positive exponents", () => {
            expectFormat(meters.squared(), "1 m^2");
            expectFormat(meters.times(seconds), "1 m * s");
            expectFormat(meters.cubed().times(seconds.squared()), "1 m^3 * s^2");
        });

        it("should format units with only negative exponents", () => {
            expectFormat(seconds.inverse(), "1 s^-1");
            expectFormat(seconds.toThe("-2"), "1 s^-2");
            expectFormat(seconds.toThe("-2").times(meters.toThe("-3")), "1 m^-3 * s^-2");
        });

        it("should format units with positive exponents and one negative exponent", () => {
            expectFormat(meters.per(seconds), "1 m / s");
            expectFormat(meters.squared().per(seconds.squared()), "1 m^2 / s^2");
            expectFormat(meters.times(kilograms).per(seconds.squared()), "1 kg * m / s^2");
        });

        it("should format units with positive exponents and negative exponents", () => {
            expectFormat(meters.per(seconds.times(kilograms)), "1 m / (kg * s)");
            expectFormat(meters.squared().per(seconds.squared().times(kilograms)), "1 m^2 / (kg * s^2)");
            expectFormat(
                meters
                    .cubed()
                    .times(kilograms)
                    .per(kilograms.cubed())
                    .per(seconds.squared()),
                "1 m^3 / (kg^2 * s^2)",
            );
        });

        it("should have consistent formatting no matter how the unit is constructed", () => {
            const metersTimesSecond = "1 m * s";
            expectFormat(meters.times(seconds), metersTimesSecond);
            expectFormat(seconds.times(meters), metersTimesSecond);

            const metersPerSecond = "1 m / s";
            expectFormat(meters.per(seconds), metersPerSecond);
            expectFormat(seconds.inverse().times(meters), metersPerSecond);
        });

        it("should not format using symbol even if present", () => {
            expect(
                Measure.of(5, meters.squared())
                    .withSymbol("m2")
                    .toString(),
            ).toBe("5 m^2");
            expect(
                Measure.dimensionless(TestUnitSystem, 0)
                    .withSymbol("rad")
                    .toString(),
            ).toBe("0");
        });

        it("should format measures as other measures with symbols", () => {
            const kilometers = Measure.of(1000, meters, "km");
            expect(Measure.of(10000, meters).in(kilometers)).toBe("10 km");
        });

        it("should use normal formatting if the other measure has no symbol", () => {
            const kilometers = Measure.of(1000, meters);
            expect(Measure.of(1000, meters).in(kilometers)).toBe("1000 m");
        });

        it("should use a custom formatter for values if provided", () => {
            expectFormat(Measure.of(3.14159, meters), "3.14 m", {
                formatValue: value => value.toPrecision(3),
            });
        });

        it("should use a custom formatter for units if provided", () => {
            expectFormat(Measure.of(3.14159, meters), "3.14159 meters", {
                formatUnit: () => "meters",
            });
        });

        it("should use both custom formatters if provided", () => {
            expectFormat(Measure.of(3.14159, meters), "3.142 meters", {
                formatValue: value => value.toPrecision(4),
                formatUnit: () => "meters",
            });
        });

        it("should not use a custom formatter for units when expressing in terms of another measure", () => {
            const kilometers = Measure.of(1000, meters, "km");
            expect(
                Measure.of(20, kilometers).in(kilometers, {
                    formatValue: value => value.toExponential(),
                    formatUnit: () => "kilometers",
                }),
            ).toBe("2e+1 km");
        });

        it("should use a custom formatter for units when expressing in terms of another unit with no symbol", () => {
            const kilometers = Measure.of(1000, meters);
            expect(
                Measure.of(20, kilometers).in(kilometers, {
                    formatUnit: () => "meters",
                }),
            ).toBe("20000 meters");
        });
    });

    describe("utils", () => {
        it("should clone", () => {
            const original = Measure.of(100, meters);
            const copy = original.clone();
            expect(original).not.toBe(copy);
            expect(original).toEqual(copy);
        });
    });
});
