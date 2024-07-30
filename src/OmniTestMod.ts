import { MR2Globals } from "magic-research-2-modding-sdk";

export function loadOmniTestMod(MR2: MR2Globals) {
  MR2.registerTransformation(
    [[MR2.TransformationTags.ActionEffect, "gatherMana"]],
    "modTest1",
    "Testing Mods",
    MR2.TransformationType.Multiplier,
    (state) => 3000.0,
  );

  MR2.registerTransformation(
    [[MR2.TransformationTags.ChannelingEfficiency, "channelFire"]],
    "modTest2",
    "Testing Mods",
    MR2.TransformationType.Multiplier,
    (state) => 4000.0,
  );
}
