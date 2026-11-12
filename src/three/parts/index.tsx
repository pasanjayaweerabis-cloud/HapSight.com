"use client";

import type { PartConfig, PartKind } from "../deviceConfig";
import { Frame, Lens, NosePad } from "./Frame";
import { EarCap, PowerSwitch, TempleCover, TempleShell } from "./Temples";
import { Battery, Charger, Controller, Driver, Motor, Sensor } from "./Modules";

/** Which component draws each kind of part. */
export function PartMesh({ part }: { part: PartConfig }) {
  const k: PartKind = part.kind;
  const side = part.side ?? "left";
  switch (k) {
    case "frame":
      return <Frame />;
    case "lens":
      return <Lens side={side} />;
    case "nosePad":
      return <NosePad />;
    case "sensor":
      return <Sensor />;
    case "templeShell":
      return <TempleShell side={side} origin={part.position} />;
    case "templeCover":
      return <TempleCover side={side} origin={part.position} />;
    case "earCap":
      return <EarCap />;
    case "motor":
      return <Motor side={side} />;
    case "controller":
      return <Controller />;
    case "driver":
      return <Driver />;
    case "battery":
      return <Battery />;
    case "charger":
      return <Charger />;
    case "powerSwitch":
      return <PowerSwitch />;
  }
}
