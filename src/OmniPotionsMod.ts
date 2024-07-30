import { MR2Globals } from "magic-research-2-modding-sdk";
import { GameState } from "magic-research-2-modding-sdk/modding-decs/backend/GameState";
import { EquippableItem } from "magic-research-2-modding-sdk/modding-decs/backend/items/equipment/EquippableItem";
import { ItemParams } from "magic-research-2-modding-sdk/modding-decs/backend/items/Item";
import { Resource } from "magic-research-2-modding-sdk/modding-decs/backend/Resources";
import { SpellElement } from "magic-research-2-modding-sdk/modding-decs/backend/spells/Elements";
import { TemporaryEffect } from "magic-research-2-modding-sdk/modding-decs/backend/temporaryeffects/TemporaryEffect";
import { TemporaryEffectData } from "magic-research-2-modding-sdk/modding-decs/backend/temporaryeffects/TemporaryEffects";

export function loadOmniPotionsAndEffects(MR2: MR2Globals) {
  MR2.alert("DEBUG: loadOmniPotionsAndEffects MOD START");
  try {
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
        return `Enhances Fire Channeling by `+fireChannelingMultiplier+` times!`;
      }

    }
    const EnhancedFireChanneling = new EnhancedFireChannelingTempEffect();
    MR2.TemporaryEffects.register(EnhancedFireChanneling);

    //Register fireChannelingMultiplier transformation but only if EnhancedFireChanneling temp effect is ON
    MR2.registerTransformation(
      [[MR2.TransformationTags.ChannelingEfficiency, "channelFire"]],
      EnhancedFireChanneling.getId(),
      EnhancedFireChanneling.getDisplayName(),
      MR2.TransformationType.Multiplier,
      (state, params) => {
        //tell the game if this temporary effect is ON, then multiply by fireChannelingMultiplier
        if (MR2.hasTemporaryEffect(state, EnhancedFireChanneling.getId())) {
          return fireChannelingMultiplier;
        }
        return 1.0;
      },
    );

    //Create the Potion of Enhanced Fire Channeling by extending MR2.BuffingPouchItem
    class PotionOfEnhancedFireChanneling extends MR2.BuffingPouchItem {
      getId(): string {
        return "omniPotionOfEnhancedFireChanneling";
      }
      getTemporaryEffect(): TemporaryEffect {
        return EnhancedFireChanneling;
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
            value: 60,
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

    //Configure and then Register the Transformation Spell AND Actual Pouch Item for PotionOfEnhancedFireChanneling by extending MR2.EquipmentTransmutationSpell
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
    const transmutePotionOfEnhancedFireChanneling = new TransmutePotionOfEnhancedFireChanneling();
    MR2.registerTransmutationSpellAndItem(transmutePotionOfEnhancedFireChanneling);

  } catch (ex) {
    MR2.alert("DEBUG: loadOmniPotionsAndEffects ERROR START");
    alert(ex);
    MR2.alert(ex);
    MR2.alert("DEBUG: loadOmniPotionsAndEffects ERROR END");
  } finally {
    MR2.alert("DEBUG: loadOmniPotionsAndEffects MOD END");
  }
}
