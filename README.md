# Safe Units

[![Build Status](https://travis-ci.org/jscheiny/safe-units.svg?branch=master)](https://travis-ci.org/jscheiny/safe-units) [![NPM Version](https://img.shields.io/npm/v/safe-units.svg)](https://www.npmjs.com/package/safe-units) [![MIT License](https://img.shields.io/npm/l/safe-units.svg)](https://github.com/jscheiny/safe-units/blob/master/LICENSE)

Safe Units is a type safe library for using units of measurement in TypeScript.  Safe Units provides an implementation of an SI based unit system but is flexible enough to allow users to create their own unit systems which can be independent or can interoperate with the built-in units. Users can also make unit systems for any numeric type they'd like not just the JavaScript `number` type. This library requires TypeScript 3.2 or higher.

```typescript
import { Length, Measure, meters, seconds, Time, Velocity } from "safe-units";

const length: Length = Measure.of(30, meters);
const time: Time = Measure.of(15, seconds);
const velocity: Velocity = length.over(time);

console.log(length.toString());   // 30 m
console.log(time.toString());     // 15 s
console.log(velocity.toString()); // 2 m * s^-1

const error: Velocity = length.times(time);
// ERROR: A measure of m*s isn't assignable to a measure of m/s.
```

## Features

⭐&nbsp; Compile-time unit arithmetic for typesafe dimensional analysis (with exponents between -5 and +5)!

⭐&nbsp; Large library of predefined units including metric (with prefixes), Imperial, and US customary units!

⭐&nbsp; Ability to add your own unit system that can work with built-in units!

⭐&nbsp; Long build times & cryptic error messages!

## Prerequisites

Safe units is written in TypeScript and should be consumed by TypeScript users to take full advantage of what it provides. In addition you will need the following:

- [TypeScript](http://www.typescriptlang.org/) 3.2 or later
- [Strict null checks](https://www.typescriptlang.org/docs/handbook/compiler-options.html) enabled for your project

## Installation

```
npm install safe-units
```

or 

```
yarn add safe-units
```

## Examples

### Unit arithmetic

```typescript
import { bars, kilograms, Measure, meters, milli, seconds } from "safe-units";

const width = Measure.of(3, meters);
const height = Measure.of(4, meters);
const area = width.times(height).scale(0.5);
const hypot = Measure.sqrt(width.squared().plus(height.squared())); // 5 m

const mass = Measure.of(30, kilograms);
const mps2 = meters.per(seconds.squared());
const acceleration = Measure.of(9.8, mps2);

const force = mass.times(acceleration); // 294 N
const pressure = force.over(area); // 49 Pa
const maxPressure = Measure.of(0.5, milli(bars)); // 0.5 mbar
pressure.lt(maxPressure) // true
```

### Type errors

```typescript
import { Force, Length, Measure, meters, seconds, Time } from "safe-units";

const length: Length = Measure.of(10, meters);
const time: Time = Measure.of(10, seconds);

length.plus(time);
// ERROR: Measures of different units cannot be added

length.minus(time);
// ERROR: Measures of different units cannot be subtracted

const force: Force = length.over(time);
// ERROR: Measure of m/s is not assignable to measure of kg*m/s^2

const root = Measure.sqrt(length);
// ERROR: Can't take sqrt of measure of m since it's not a perfect square
```

### Naming units

```typescript
import { days, Measure, miles, speedOfLight, yards } from "safe-units";

const furlongs = Measure.of(220, yards, "fur");

console.log(Measure.of(8, furlongs).in(miles)); // 1 mi
console.log(Measure.of(1, miles).in(furlongs)); // 8 fur

const fortnights = Measure.of(14, days, "ftn");
const megaFurlongsPerMicroFortnight = mega(furlongs)
    .per(micro(fortnights))
    .withSymbol("Mfur/µftn");

console.log(speedOfLight.in(megaFurlongsPerMicroFortnight)); // 1.8026174997852542 Mfur/µftn
```

### Converting units for external use
```typescript
const distanceInFurlongs: number = Measure.of(2, miles).valueIn(furlongs); // 16
```
### Deriving quantities

```typescript
import { Acceleration, Measure, meters, seconds, Time } from "safe-units";

const Jerk = Acceleration.over(Time);
type Jerk = typeof Jerk;

const mps2 = meters.per(seconds.squared());
const acceleration = Measure.of(9.8, mps2);
const jerk: Jerk = acceleration.over(Measure.of(2, seconds));

console.log(jerk.toString()); // 4.9 m * s^-3
```

### Defining dimensions

```typescript
import { Area, Measure, minutes, seconds, Time } from "safe-units";

const frames = Measure.dimension("frames");

const Frames = frames;
type Frames = typeof frames;

const FrameRate = Frames.over(Time);
type FrameRate = typeof FrameRate;

const fps: FrameRate = frames.per(seconds).withSymbol("fps");

const minFrameRate = Measure.of(60, fps);

const measuredFrames = Measure.of(8000, frames);
const elapsedTime = Measure.of(2, minutes);
const measuredFps: FrameRate = measuredFrames.over(elapsedTime);

if (measuredFps.lt(minFrameRate)) {
    // Optimize
}
```
