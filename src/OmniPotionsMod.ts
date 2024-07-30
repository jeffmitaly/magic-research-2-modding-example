import { MR2Globals } from "magic-research-2-modding-sdk";
import { GameState } from "magic-research-2-modding-sdk/modding-decs/backend/GameState";
import { EquippableItem } from "magic-research-2-modding-sdk/modding-decs/backend/items/equipment/EquippableItem";
import { ItemParams } from "magic-research-2-modding-sdk/modding-decs/backend/items/Item";
import { Resource } from "magic-research-2-modding-sdk/modding-decs/backend/Resources";
import { SpellElement } from "magic-research-2-modding-sdk/modding-decs/backend/spells/Elements";
import { TemporaryEffect } from "magic-research-2-modding-sdk/modding-decs/backend/temporaryeffects/TemporaryEffect";
import { TemporaryEffectData } from "magic-research-2-modding-sdk/modding-decs/backend/temporaryeffects/TemporaryEffects";

export function loadOmniPotionsAndEffects(MR2: MR2Globals) {

  //TODO: Just playing around here - 50k fireChannelingMultiplier
  const fireChannelingMultiplier = 50000.0;

  //register Temporary Effect for Fire Channeling 
  class EnhancedFireChannelingTempEffect extends MR2.TemporaryEffect {
    getId(): string {
      return "omniEnhancedFireChannelingTempEffect";
    }

    getDisplayName(): string {
      return "Enhanced Fire Channeling";
    }

    getDisplayDescription(
      state: GameState,
      temporaryEffectData: TemporaryEffectData,
    ): string {


      //TODO: Figure out how to display that we are enhancing the fire channeling by X percent here...

      //TODO: These are just examples for now...
      //const studyExpMultiplier = temporaryEffectData.params.studyExp + 1.0;
      //const attack = temporaryEffectData.params.attack;

      return `Enhanced Fire Channeling Display Goes Here`;
    }


  }
  const EnhancedFireChannelingEffect = new EnhancedFireChannelingTempEffect()
  MR2.TemporaryEffects.register(EnhancedFireChannelingEffect);

  //tell the game if this temporary effect is ON, then multiply by fireChannelingMultiplier
  MR2.registerTransformation(
    [[MR2.TransformationTags.ChannelingEfficiency, "channelFire"]],
    EnhancedFireChannelingEffect.getId(),
    EnhancedFireChannelingEffect.getDisplayName(),
    MR2.TransformationType.Multiplier,
    (state, params) => {
      if (MR2.hasTemporaryEffect(state, EnhancedFireChannelingEffect.getId())) {
        return fireChannelingMultiplier;
      }
      return 1.0;
    },
  );

  //Create the Potion of Enhanced Fire Channeling
  class PotionOfEnhancedFireChanneling extends MR2.BuffingPouchItem {
    getId(): string {
      return "potionOfEnhancedFireChanneling";
    }

    getTemporaryEffect(): TemporaryEffect {
      return EnhancedFireChannelingEffect;
    }

    getBaseName(params: ItemParams) {
      return "Potion of Enhanced Fire Channeling";
    }
    getDescription(state: GameState, params: ItemParams) {
      return `A potion that greatly increases your fire channeling for a short while.`;
    }
    getBaseItemEffects(params: ItemParams) {
      return {
        duration: {
          value: 300,
          tags: [MR2.TransformationTags.TemporaryEffectDuration],
          unit: " sec",
        },
      };
    }

    getPicture(): any {

      //TODO: Update PNG - it shouldn't be green lol...
      return require("./potionOfFireChanneling.png");

    }

    getEffect(state: GameState, params: ItemParams) {
      const effects = this.getItemEffects(state, params);
      const explanations = this.getItemEffectExplanations(state, params);
      return `Greatly increase fire channeling for ^${MR2.formatNumber(effects.duration)}^<${
        explanations.duration
      }> sec`;
    }

    getBaseSalePrice(state: GameState, params: ItemParams) {
      return 1200;
    }
  }
  const potionOfEnhancedFireChanneling = new PotionOfEnhancedFireChanneling();

  //Register and Configure the Transformation AND Item for PotionOfEnhancedFireChanneling
  class TransmutePotionOfEnhancedFireChanneling extends MR2.EquipmentTransmutationSpell {
    getItem(): EquippableItem {
      return potionOfEnhancedFireChanneling;
    }

    getElement(): SpellElement | undefined {
      return MR2.SpellElement.Fire;
    }

    getCraftingMaterialsBase(state: GameState): {
      resources: Partial<Record<Resource, number>>;
      items: Record<string, number>;
    } {
      return {
        resources: {
          FireEssence: 50,
        },
        items: {
          elementalShardFire: 10
        },
      };
    }

    getCraftingElementLevelRequirements(): Partial<
      Record<SpellElement, number>
    > {
      return {
        Fire: 40,
      };
    }
  }
  const transmutepotionOfEnhancedFireChanneling = new TransmutePotionOfEnhancedFireChanneling();
  MR2.registerTransmutationSpellAndItem(transmutepotionOfEnhancedFireChanneling);

}
