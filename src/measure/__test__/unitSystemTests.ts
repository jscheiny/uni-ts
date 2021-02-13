import { UnitSystem } from "../unitSystem";

describe("Unit system", () => {
    const unitSystem = new UnitSystem({
        length: "m",
        mass: "kg",
    });

    describe("getSymbol", () => {
        it("should get the correct symbol", () => {
            expect(unitSystem.getSymbol("length")).toBe("m");
            expect(unitSystem.getSymbol("mass")).toBe("kg");
        });
    });

    describe("createDimensionlessUnit", () => {
        it("should construct a dimensionless unit", () => {
            expect(unitSystem.createDimensionlessUnit()).toEqual({
                length: "0",
                mass: "0",
            });
        });
    });

    describe("createDimensionUnit", () => {
        it("should construct a base unit for each dimension", () => {
            expect(unitSystem.createDimensionUnit("length")).toEqual({
                length: "1",
                mass: "0",
            });

            expect(unitSystem.createDimensionUnit("mass")).toEqual({
                length: "0",
                mass: "1",
            });
        });
    });
});
