import { Measure } from "../src/measure/numberMeasure";
import { UnitSystem } from "../src/measure/unitSystem";
import { assertRelation } from "./utils";

// Setup

type TestBasis = "length" | "time" | "mass";

export interface TestSystem extends Record<TestBasis, unknown> {}

const TestSystem = new UnitSystem<TestSystem>({
    length: "m",
    time: "s",
    mass: "kg",
});

const Length = Measure.dimension(TestSystem, "length");
type Length = typeof Length;

const Time = Measure.dimension(TestSystem, "time");
type Time = typeof Time;

const Area = Length.squared();
type Area = typeof Area;

const Volume = Length.cubed();
type Volume = typeof Volume;

const Velocity = Length.over(Time);
type Velocity = typeof Velocity;

// Valid usages

const meters = Measure.dimension(TestSystem, "length");
assertRelation<typeof meters, Measure<TestSystem, { length: "1"; time: "0"; mass: "0" }>>().isSame();
const seconds = Measure.dimension(TestSystem, "time");
const kilograms = Measure.dimension(TestSystem, "mass");

const newtons = kilograms.times(meters.per(seconds.squared()));
assertRelation<typeof newtons, Measure<TestSystem, { length: "1"; time: "-2"; mass: "1" }>>().isSame();

const accel = newtons.over(kilograms);
assertRelation<typeof accel, Measure<TestSystem, { length: "1"; time: "-2"; mass: "0" }>>().isSame();

const absement = meters.times(seconds);
assertRelation<typeof absement, Measure<TestSystem, { length: "1"; time: "1"; mass: "0" }>>().isSame();
const velocity = meters.over(seconds);
assertRelation<typeof velocity, Measure<TestSystem, { length: "1"; time: "-1"; mass: "0" }>>().isSame();

const twoMeters = meters.plus(meters);
assertRelation<typeof twoMeters, Measure<TestSystem, { length: "1"; time: "0"; mass: "0" }>>().isSame();
const zeroMeters = meters.minus(meters);
assertRelation<typeof zeroMeters, Measure<TestSystem, { length: "1"; time: "0"; mass: "0" }>>().isSame();
const negativeOneMeter = meters.negate();
assertRelation<typeof negativeOneMeter, Measure<TestSystem, { length: "1"; time: "0"; mass: "0" }>>().isSame();
const twoMetersAgain = meters.scale(2);
assertRelation<typeof twoMetersAgain, Measure<TestSystem, { length: "1"; time: "0"; mass: "0" }>>().isSame();

const velocitySquared = velocity.squared();
assertRelation<typeof velocitySquared, Measure<TestSystem, { length: "2"; time: "-2"; mass: "0" }>>().isSame();
const absementCubed = absement.cubed();
assertRelation<typeof absementCubed, Measure<TestSystem, { length: "3"; time: "3"; mass: "0" }>>().isSame();
const absementInv = absement.inverse();
assertRelation<typeof absementInv, Measure<TestSystem, { length: "-1"; time: "-1"; mass: "0" }>>().isSame();
const dimensionless = velocity.toThe("0");
assertRelation<typeof dimensionless, Measure<TestSystem, { length: "0"; time: "0"; mass: "0" }>>().isSame();

const sqrt = Measure.sqrt(velocity.toThe("-4"));
assertRelation<typeof sqrt, Measure<TestSystem, { length: "-2"; time: "2"; mass: "0" }>>().isSame();
const cbrt = Measure.cbrt(absement.toThe("3"));
assertRelation<typeof cbrt, Measure<TestSystem, { length: "1"; time: "1"; mass: "0" }>>().isSame();

// Error usages

declare const volume: Volume;
declare const area: Area;
declare const time: Time;

// @ts-expect-error
volume.times(volume);
const volumeInverse = volume.inverse();
// @ts-expect-error
volume.over(volumeInverse);

// @ts-expect-error
volume.plus(area);
// @ts-expect-error
area.minus(volume);

// @ts-expect-error
volume.squared();
// @ts-expect-error
area.cubed();
// @ts-expect-error
area.toThe("4");
// @ts-expect-error
volume.toThe("-2");

// @ts-expect-error
Measure.sqrt(volume);
// @ts-expect-error
Measure.cbrt(area);

// @ts-expect-error
const length1: Length = seconds;
// @ts-expect-error
const length2: Length = velocity;
// @ts-expect-error
const length3: Length = area;
// @ts-expect-error
const length4: Length = volume;
// @ts-expect-error
const velocity1: Velocity = length;
// @ts-expect-error
const velocity2: Velocity = time;
// @ts-expect-error
const velocity3: Velocity = time.inverse();
