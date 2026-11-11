"use client";

import type { PartConfig, PartKind } from "../deviceConfig";
import { BandLining, BandShell, EarHook, LedStrip, RibbonCable, SensorMount, Strap } from "./Shell";
import { HapticBoard, SensorModule, TemplePad, VibrationMotor } from "./Modules";
import {
  Battery,
  Buckle,
  ChargingBoard,
  Controller,
  Led,
  LightSensor,
  PauseButton,
  PodShellInner,
  PodShellOuterLeft,
  PodShellOuterRight,
  SosButton,
  Speaker,
} from "./Pods";

/** Which component draws each kind of part. */
export function PartMesh({ part }: { part: PartConfig }) {
  const k: PartKind = part.kind;
  switch (k) {
    case "bandShell":
      return <BandShell />;
    case "bandLining":
      return <BandLining />;
    case "ribbonCable":
      return <RibbonCable />;
    case "earHook":
      return <EarHook side={part.side ?? "left"} />;
    case "sensorMount":
      return <SensorMount />;
    case "sensorModule":
      return <SensorModule />;
    case "templePad":
      return <TemplePad />;
    case "vibrationMotor":
      return <VibrationMotor />;
    case "hapticBoard":
      return <HapticBoard />;
    case "podShellInner":
      return <PodShellInner />;
    case "podShellOuterLeft":
      return <PodShellOuterLeft />;
    case "podShellOuterRight":
      return <PodShellOuterRight />;
    case "sosButton":
      return <SosButton />;
    case "pauseButton":
      return <PauseButton />;
    case "led":
      return <Led />;
    case "controller":
      return <Controller />;
    case "speaker":
      return <Speaker />;
    case "battery":
      return <Battery />;
    case "chargingBoard":
      return <ChargingBoard />;
    case "strap":
      return <Strap />;
    case "ledStrip":
      return <LedStrip />;
    case "buckle":
      return <Buckle />;
    case "lightSensor":
      return <LightSensor />;
  }
}
