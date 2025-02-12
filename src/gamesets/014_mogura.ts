import * as PIXI from "pixi.js";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
PixiPlugin.registerPIXI(PIXI);
import { replaceHash } from "./001_game_master";

import { settings } from "../SiteInterface";
import { GlowFilter } from "pixi-filters";
export function GM_start(app: PIXI.Application): Promise<void> {
  return new Promise(async (resolve) => {
    const glowFilter = new GlowFilter({
      distance: 28, // Glow distance
      outerStrength: 6, // Outer glow strength
      innerStrength: 0, // Inner glow strength
      color: 0xff0000, // Glow color
      quality: 0.4,
      alpha: 0.1, // Glow quality
    });

    const star = new PIXI.Graphics();
    star.x = app.screen.width / 2;
    star.y = app.screen.height / 2;

    star.moveTo(0, -200);
    star
      .quadraticCurveTo(0, 0, 200, 0)
      .quadraticCurveTo(0, 0, 0, 200)
      .quadraticCurveTo(0, 0, -200, 0)
      .quadraticCurveTo(0, 0, 0, -200)
      .fill(replaceHash(settings.colorTheme.colors.MainAccent));
    star.filters = glowFilter;
    app.stage.addChild(star);
    star.alpha = 0.5;
    gsap.fromTo(
      star,
      { rotation: 3.14 / 5 },
      {
        rotation: 0,
        duration: 1,
        ease: "power4.out",
      }
    );
    gsap.to(star, {
      alpha: 0,
      duration: 0.05, // Fade out duration
      repeat: 3, // Total 4 transitions (2 full blinks)
      yoyo: true, // Alternate between fade in and fade out
      ease: "none", // Linear transition
    });

    setTimeout(() => {
      app.stage.removeChild(star);
      resolve();
    }, 2500);
  });
}
