import { GenericMeasure, LiftMeasure } from "../measure/genericMeasure";
import { Measure } from "../measure/numberMeasure";
import { DimensionlessUnit } from "../measure/unitTypeArithmetic";
import * as Base from "./base";

// Dimensionless

/** A measure in the Metric system without any unit */
export type Dimensionless<N = number> = GenericMeasure<N, Base.MetricSystem, DimensionlessUnit<Base.MetricSystem>>;
export const Dimensionless: Dimensionless = Measure.dimensionless(Base.MetricSystem, 1);

// Base units

/** meters */
export type Length<N = number> = LiftMeasure<typeof Base.meters, N>;
export const Length: Length = Base.meters;

/** kilograms */
export type Mass<N = number> = LiftMeasure<typeof Base.kilograms, N>;
export const Mass: Mass = Base.kilograms;

/** seconds */
export type Time<N = number> = LiftMeasure<typeof Base.seconds, N>;
export const Time: Time = Base.seconds;

/** Amperes */
export type ElectricCurrent<N = number> = LiftMeasure<typeof Base.amperes, N>;
export const ElectricCurrent: ElectricCurrent = Base.amperes;

/** Kelvin */
export type Temperature<N = number> = LiftMeasure<typeof Base.kelvin, N>;
export const Temperature: Temperature = Base.kelvin;

/** moles */
export type AmountOfSubstance<N = number> = LiftMeasure<typeof Base.moles, N>;
export const AmountOfSubstance: AmountOfSubstance = Base.moles;

/** candelas */
export type LuminousIntensity<N = number> = LiftMeasure<typeof Base.candelas, N>;
export const LuminousIntensity: LuminousIntensity = Base.candelas;

/** bits */
export type Memory<N = number> = LiftMeasure<typeof Base.bits, N>;
export const Memory: Memory = Base.bits;

// Angular base units

/** radians */
export type PlaneAngle<N = number> = LiftMeasure<typeof Base.radians, N>;
export const PlaneAngle: PlaneAngle = Base.radians;

/** steradians */
export type SolidAngle<N = number> = LiftMeasure<typeof Base.steradians, N>;
export const SolidAngle: SolidAngle = Base.steradians;

// Derived units

/** 1 / s */
export type Frequency<N = number> = LiftMeasure<typeof Frequency, N>;
export const Frequency = Time.inverse();

/** 1 / s² */
export type FrequencyDrift<N = number> = LiftMeasure<typeof FrequencyDrift, N>;
export const FrequencyDrift = Time.toThe("-2");

/** 1 / m² */
export type FuelEfficiency<N = number> = LiftMeasure<typeof FuelEfficiency, N>;
export const FuelEfficiency = Length.toThe("-2");

/** 1 / m */
export type Wavenumber<N = number> = LiftMeasure<typeof Wavenumber, N>;
export const Wavenumber = Length.inverse();

/** m² */
export type Area<N = number> = LiftMeasure<typeof Area, N>;
export const Area = Length.squared();

/** m³ */
export type Volume<N = number> = LiftMeasure<typeof Volume, N>;
export const Volume = Length.cubed();

/** m ⋅ s */
export type Absement<N = number> = LiftMeasure<typeof Absement, N>;
export const Absement = Length.times(Time);

/** m / s */
export type Velocity<N = number> = LiftMeasure<typeof Velocity, N>;
export const Velocity = Length.over(Time);

/** m / s² */
export type Acceleration<N = number> = LiftMeasure<typeof Acceleration, N>;
export const Acceleration = Velocity.over(Time);

/** m / s³ */
export type Jerk<N = number> = LiftMeasure<typeof Jerk, N>;
export const Jerk = Acceleration.over(Time);

/** m / s⁴ */
export type Jounce<N = number> = LiftMeasure<typeof Jounce, N>;
export const Jounce = Jerk.over(Time);

/** m / s⁵ */
export type Crackle<N = number> = LiftMeasure<typeof Crackle, N>;
export const Crackle = Jounce.over(Time);

/** m³ / s */
export type VolumetricFlow<N = number> = LiftMeasure<typeof VolumetricFlow, N>;
export const VolumetricFlow = Volume.over(Time);

/** kg / s */
export type MassFlowRate<N = number> = LiftMeasure<typeof MassFlowRate, N>;
export const MassFlowRate = Mass.over(Time);

/** kg / m */
export type LinearDensity<N = number> = LiftMeasure<typeof LinearDensity, N>;
export const LinearDensity = Mass.over(Length);

/** kg / m²  */
export type AreaDensity<N = number> = LiftMeasure<typeof AreaDensity, N>;
export const AreaDensity = Mass.over(Area);

/** kg / m³ */
export type VolumeDensity<N = number> = LiftMeasure<typeof VolumeDensity, N>;
export const VolumeDensity = Mass.over(Volume);

/** kg ⋅ m / s² */
export type Force<N = number> = LiftMeasure<typeof Force, N>;
export const Force = Mass.times(Acceleration);

/** km ⋅ m / s³ */
export type Yank<N = number> = LiftMeasure<typeof Yank, N>;
export const Yank = Force.over(Time);

/** kg / (m ⋅ s²)  */
export type Pressure<N = number> = LiftMeasure<typeof Pressure, N>;
export const Pressure = Force.over(Area);

/** m ⋅ s² / kg */
export type Compressibility<N = number> = LiftMeasure<typeof Compressibility, N>;
export const Compressibility = Pressure.inverse();

/** kg / (m ⋅ s) */
export type DynamicViscosity<N = number> = LiftMeasure<typeof DynamicViscosity, N>;
export const DynamicViscosity = Pressure.times(Time);

/** kg / s² */
export type SurfaceTension<N = number> = LiftMeasure<typeof SurfaceTension, N>;
export const SurfaceTension = Force.over(Length);

/** kg ⋅ m / s  */
export type Momentum<N = number> = LiftMeasure<typeof Momentum, N>;
export const Momentum = Force.times(Time);

/** kg ⋅ m² */
export type MomentOfInertia<N = number> = LiftMeasure<typeof MomentOfInertia, N>;
export const MomentOfInertia = Mass.times(Area);

/** kg ⋅ m² / s² */
export type Energy<N = number> = LiftMeasure<typeof Energy, N>;
export const Energy = Force.times(Length);

/** kg ⋅ m² / s³ */
export type Power<N = number> = LiftMeasure<typeof Power, N>;
export const Power = Energy.over(Time);

/** kg / (m ⋅ s³) */
export type PowerDensity<N = number> = LiftMeasure<typeof PowerDensity, N>;
export const PowerDensity = Power.over(Volume);

/** kg ⋅ m² / (s³ ⋅ A) */
export type Voltage<N = number> = LiftMeasure<typeof Voltage, N>;
export const Voltage = Power.over(ElectricCurrent);

/** s ⋅ A */
export type ElectricCharge<N = number> = LiftMeasure<typeof ElectricCharge, N>;
export const ElectricCharge = ElectricCurrent.times(Time);

/** s ⋅ A / m³ */
export type ElectricChargeDensity<N = number> = LiftMeasure<typeof ElectricChargeDensity, N>;
export const ElectricChargeDensity = ElectricCharge.over(Volume);

/** A / m² */
export type ElectricCurrentDensity<N = number> = LiftMeasure<typeof ElectricCurrentDensity, N>;
export const ElectricCurrentDensity = ElectricCurrent.over(Area);

/** s ⋅ A / m² */
export type ElectricDisplacement<N = number> = LiftMeasure<typeof ElectricDisplacement, N>;
export const ElectricDisplacement = ElectricCharge.over(Area);

/** kg ⋅ m / (s³ ⋅ A) */
export type EletricFieldStrength<N = number> = LiftMeasure<typeof EletricFieldStrength, N>;
export const EletricFieldStrength = Voltage.over(Length);

/** s⁴ ⋅ A² / (kg ⋅ m²) */
export type ElectricalCapacitance<N = number> = LiftMeasure<typeof ElectricalCapacitance, N>;
export const ElectricalCapacitance = ElectricCharge.over(Voltage);

/** s³ ⋅ A / (kg ⋅ m²) */
export type ElectricalConductance<N = number> = LiftMeasure<typeof ElectricalConductance, N>;
export const ElectricalConductance = ElectricCurrent.over(Voltage);

/** s³ ⋅ A² / (kg ⋅ m³) */
export type ElectricalConductivity<N = number> = LiftMeasure<typeof ElectricalConductivity, N>;
export const ElectricalConductivity = ElectricalConductance.over(Length);

/** kg ⋅ m² / (s³ ⋅ A²) */
export type ElectricalResistance<N = number> = LiftMeasure<typeof ElectricalResistance, N>;
export const ElectricalResistance = Voltage.over(ElectricCurrent);

/** kg ⋅ m³ / (s³ ⋅ A²) */
export type ElectricalResistivity<N = number> = LiftMeasure<typeof ElectricalResistivity, N>;
export const ElectricalResistivity = ElectricalResistance.times(Length);

/** kg ⋅ m² / (s² ⋅ A²) */
export type ElectricalInductance<N = number> = LiftMeasure<typeof ElectricalInductance, N>;
export const ElectricalInductance = ElectricalResistance.times(Time);

/** s ⋅ A / m */
export type LinearChargeDensity<N = number> = LiftMeasure<typeof LinearChargeDensity, N>;
export const LinearChargeDensity = ElectricCharge.over(Length);

/** s⁴ ⋅ A² / (kg ⋅ m³) */
export type Permittivity<N = number> = LiftMeasure<typeof Permittivity, N>;
export const Permittivity = ElectricalCapacitance.over(Length);

/** kg ⋅ m² / (s² ⋅ A) */
export type MagneticFlux<N = number> = LiftMeasure<typeof MagneticFlux, N>;
export const MagneticFlux = Energy.over(ElectricCurrent);

/** kg / (s² ⋅ A) */
export type MagneticFluxDensity<N = number> = LiftMeasure<typeof MagneticFluxDensity, N>;
export const MagneticFluxDensity = Voltage.times(Time).over(Area);

/** kg ⋅ m / (s² ⋅ A²)  */
export type MagneticPermeability<N = number> = LiftMeasure<typeof MagneticPermeability, N>;
export const MagneticPermeability = ElectricalInductance.over(Length);

/** A / m */
export type Magnetization<N = number> = LiftMeasure<typeof Magnetization, N>;
export const Magnetization = ElectricCurrent.over(Length);

/** s² ⋅ A² / (kg ⋅ m²) */
export type MagneticReluctance<N = number> = LiftMeasure<typeof MagneticReluctance, N>;
export const MagneticReluctance = ElectricalInductance.inverse();

/** kg ⋅ m³ / (s² ⋅ A) */
export type MagneticMoment<N = number> = LiftMeasure<typeof MagneticMoment, N>;
export const MagneticMoment = MagneticFlux.times(Length);

/** kg ⋅ m / (s² ⋅ A) */
export type MagneticRigidity<N = number> = LiftMeasure<typeof MagneticRigidity, N>;
export const MagneticRigidity = MagneticFluxDensity.times(Length);

/** m² ⋅ A */
export type MagneticDipoleMoment<N = number> = LiftMeasure<typeof MagneticDipoleMoment, N>;
export const MagneticDipoleMoment = Energy.over(MagneticFluxDensity);

/** s² ⋅ A² / (kg ⋅ m) */
export type MagneticSusceptibility<N = number> = LiftMeasure<typeof MagneticSusceptibility, N>;
export const MagneticSusceptibility = Length.over(ElectricalInductance);

/** kg / s³  */
export type Irradiance<N = number> = LiftMeasure<typeof Irradiance, N>;
export const Irradiance = Power.over(Area);

/** kg ⋅ m / (s² ⋅ K)  */
export type Entropy<N = number> = LiftMeasure<typeof Entropy, N>;
export const Entropy = Energy.over(Temperature);

/** m² / (s² ⋅ K) */
export type SpecificHeat<N = number> = LiftMeasure<typeof SpecificHeat, N>;
export const SpecificHeat = Energy.over(Mass.times(Temperature));

/** m³ / kg  */
export type SpecificVolume<N = number> = LiftMeasure<typeof SpecificVolume, N>;
export const SpecificVolume = Volume.over(Mass);

/** kg ⋅ m / (s³ ⋅ K)  */
export type ThermalConductivity<N = number> = LiftMeasure<typeof ThermalConductivity, N>;
export const ThermalConductivity = Power.over(Length.times(Temperature));

/** s³ ⋅ K / (kg ⋅ m²) */
export type ThermalResistance<N = number> = LiftMeasure<typeof ThermalResistance, N>;
export const ThermalResistance = Temperature.over(Power);

/** 1 / K */
export type ThermalExpansionCoefficient<N = number> = LiftMeasure<typeof ThermalExpansionCoefficient, N>;
export const ThermalExpansionCoefficient = Temperature.inverse();

/** K / m */
export type ThermalGradient<N = number> = LiftMeasure<typeof ThermalGradient, N>;
export const ThermalGradient = Temperature.over(Length);

/** kg ⋅ m² / (s² ⋅ K ⋅ mol) */
export type MolarEntropy<N = number> = LiftMeasure<typeof MolarEntropy, N>;
export const MolarEntropy = Entropy.over(AmountOfSubstance);

/** kg ⋅ m² / (s² ⋅ mol) */
export type MolarEnergy<N = number> = LiftMeasure<typeof MolarEnergy, N>;
export const MolarEnergy = Energy.over(AmountOfSubstance);

/** mol / m³ */
export type Molarity<N = number> = LiftMeasure<typeof Molarity, N>;
export const Molarity = AmountOfSubstance.over(Volume);

/** m³ / mol */
export type MolarVolume<N = number> = LiftMeasure<typeof MolarVolume, N>;
export const MolarVolume = Volume.over(AmountOfSubstance);

/** mol / kg */
export type Molality<N = number> = LiftMeasure<typeof Molality, N>;
export const Molality = AmountOfSubstance.over(Mass);

/** kg / mol  */
export type MolarMass<N = number> = LiftMeasure<typeof MolarMass, N>;
export const MolarMass = Mass.over(AmountOfSubstance);

/** s³ ⋅ A² / (kg ⋅ mol) */
export type MolarConductivity<N = number> = LiftMeasure<typeof MolarConductivity, N>;
export const MolarConductivity = ElectricalConductance.times(Area).over(AmountOfSubstance);

/** mol / s */
export type CatalyticActivity<N = number> = LiftMeasure<typeof CatalyticActivity, N>;
export const CatalyticActivity = AmountOfSubstance.over(Time);

/** m³ / (s ⋅ mol) */
export type CatalyticEfficiency<N = number> = LiftMeasure<typeof CatalyticEfficiency, N>;
export const CatalyticEfficiency = Volume.over(AmountOfSubstance.times(Time));

/** mol / (m³ ⋅ s)  */
export type ReactionRate<N = number> = LiftMeasure<typeof ReactionRate, N>;
export const ReactionRate = CatalyticActivity.over(Volume);

/** m² / s² */
export type RadiationDose<N = number> = LiftMeasure<typeof RadiationDose, N>;
export const RadiationDose = Energy.over(Mass);

/** m² / s³ */
export type RadiationDoseRate<N = number> = LiftMeasure<typeof RadiationDoseRate, N>;
export const RadiationDoseRate = RadiationDose.over(Time);

/** s² ⋅ A / kg  */
export type ElectronMobility<N = number> = LiftMeasure<typeof ElectronMobility, N>;
export const ElectronMobility = Area.over(Voltage.times(Time));

/** kg ⋅ m² / s */
export type AngularMomentum<N = number> = LiftMeasure<typeof AngularMomentum, N>;
export const AngularMomentum = Force.times(Length).times(Time);

/** m² /s */
export type SpecificAngularMomentum<N = number> = LiftMeasure<typeof SpecificAngularMomentum, N>;
export const SpecificAngularMomentum = AngularMomentum.over(Mass);

/** cd / m² */
export type Luminance<N = number> = LiftMeasure<typeof Luminance, N>;
export const Luminance = LuminousIntensity.over(Area);

// Angular derived units

/** cd ⋅ sr */
export type LuminousFlux<N = number> = LiftMeasure<typeof LuminousFlux, N>;
export const LuminousFlux = LuminousIntensity.times(SolidAngle);

/** cd ⋅ sr / m² */
export type Illuminance<N = number> = LiftMeasure<typeof Illuminance, N>;
export const Illuminance = LuminousFlux.over(Area);

/** s ⋅ cd ⋅ sr */
export type LuminousEnergy<N = number> = LiftMeasure<typeof LuminousEnergy, N>;
export const LuminousEnergy = LuminousFlux.times(Time);

/** s ⋅ cd ⋅ sr / m² */
export type LuminousExposure<N = number> = LiftMeasure<typeof LuminousExposure, N>;
export const LuminousExposure = Illuminance.times(Time);

/** s³ ⋅ cd ⋅ sr / (kg ⋅ m²) */
export type LuminousEfficiency<N = number> = LiftMeasure<typeof LuminousEfficiency, N>;
export const LuminousEfficiency = LuminousFlux.over(Power);

/** kg ⋅ m² / (s³ ⋅ sr) */
export type RadiantIntensity<N = number> = LiftMeasure<typeof RadiantIntensity, N>;
export const RadiantIntensity = Power.over(SolidAngle);

/** kg ⋅ m / (s³ ⋅ sr)  */
export type SpectralIntensity<N = number> = LiftMeasure<typeof SpectralIntensity, N>;
export const SpectralIntensity = RadiantIntensity.over(Length);

/** kg / (s³ ⋅ sr) */
export type Radiance<N = number> = LiftMeasure<typeof Radiance, N>;
export const Radiance = RadiantIntensity.over(Area);

/** kg / (m ⋅ s³ ⋅ sr) */
export type SpectralRadiance<N = number> = LiftMeasure<typeof SpectralRadiance, N>;
export const SpectralRadiance = RadiantIntensity.over(Volume);

/** rad / s */
export type AngularVelocity<N = number> = LiftMeasure<typeof AngularVelocity, N>;
export const AngularVelocity = PlaneAngle.over(Time);

/** rad / s² */
export type AngularAcceleration<N = number> = LiftMeasure<typeof AngularAcceleration, N>;
export const AngularAcceleration = AngularVelocity.over(Time);
