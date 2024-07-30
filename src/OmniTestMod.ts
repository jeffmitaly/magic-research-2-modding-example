import { MR2Globals } from "magic-research-2-modding-sdk";

export function loadOmniTestMod(MR2: MR2Globals) {


  //multiple gather mana by 50,000 
  MR2.registerTransformation(
    [[MR2.TransformationTags.ActionEffect, "gatherMana"]],
    "MultipleGatherMana",
    "Testing Mods",
    MR2.TransformationType.Multiplier,
    (state) => 50000.0,
  );

}
