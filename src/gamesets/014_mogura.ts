import * as PIXI from "pixi.js";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
PixiPlugin.registerPIXI(PIXI);
import { replaceHash } from "./001_game_master";

import { settings } from "../SiteInterface";
export function GM_start(app: PIXI.Application): Promise<void> {
  return new Promise(async (resolve) => {
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
      duration: 0.05,
      repeat: 3,
      yoyo: true,
      ease: "none",
    });

    const sec_star = new PIXI.Graphics();
    sec_star.x = app.screen.width / 2;
    sec_star.y = app.screen.height / 2;

    sec_star.moveTo(0, -200);
    sec_star
      .quadraticCurveTo(0, 0, 200, 0)
      .quadraticCurveTo(0, 0, 0, 200)
      .quadraticCurveTo(0, 0, -200, 0)
      .quadraticCurveTo(0, 0, 0, -200)
      .fill(replaceHash(settings.colorTheme.colors.SecondAccent));
    app.stage.addChild(star);
    sec_star.alpha = 0.5;
    setTimeout(() => {
      gsap.fromTo(
        sec_star,
        { rotation: 3.14 / 5 },
        {
          rotation: 0,
          duration: 1,
          ease: "power4.out",
        }
      );
      gsap.to(sec_star, {
        alpha: 0,
        duration: 0.05,
        repeat: 3,
        yoyo: true,
        ease: "none",
      });
    }, 1000);

    setTimeout(() => {
      app.stage.removeChild(star);
      app.stage.removeChild(sec_star);
      resolve();
    }, 1000);
  });
}
export function closeScene(app: PIXI.Application): Promise<void> {
  return new Promise(async (resolve) => {
    const closeSecond = new PIXI.Graphics();
    closeSecond
      .rect(0, 0, app.screen.width, app.screen.height)
      .fill(replaceHash(settings.colorTheme.colors.SecondAccent));
    closeSecond.position = { x: 0, y: 0 };
    app.stage.addChild(closeSecond);
    const closeAccent = new PIXI.Graphics();
    closeAccent
      .rect(0, 0, app.screen.width, app.screen.height)
      .fill(replaceHash(settings.colorTheme.colors.MainAccent));
    app.stage.addChild(closeAccent);
    gsap.fromTo(
      closeSecond,
      { x: -app.screen.width },
      { x: 0, duration: 1, ease: "power3.inOut", delay: 0 }
    );
    gsap.fromTo(
      closeAccent,
      { x: -app.screen.width },
      { x: 0, duration: 1, ease: "power3.inOut", delay: 0.2 }
    );
    setTimeout(() => {
      app.stage.removeChild(closeSecond);
      app.stage.removeChild(closeAccent);
      resolve();
    }, 2000);
  });
}
export function openScene(app: PIXI.Application): Promise<void> {
  return new Promise(async (resolve) => {
    const openSecond = new PIXI.Graphics();
    openSecond
      .rect(0, 0, app.screen.width, app.screen.height)
      .fill(replaceHash(settings.colorTheme.colors.SecondAccent));
    openSecond.position = { x: 0, y: 0 };
    app.stage.addChild(openSecond);
    const openAccent = new PIXI.Graphics();
    openAccent
      .rect(0, 0, app.screen.width, app.screen.height)
      .fill(replaceHash(settings.colorTheme.colors.MainAccent));
    app.stage.addChild(openAccent);
    gsap.fromTo(
      openSecond,
      { x: 0 },
      { x: app.screen.width, duration: 0.5, ease: "power4.Out", delay: 0 }
    );
    gsap.fromTo(
      openAccent,
      { x: 0 },
      { x: app.screen.width, duration: 0.5, ease: "power4.Out", delay: 0.1 }
    );
    setTimeout(() => {
      app.stage.removeChild(openSecond);
      app.stage.removeChild(openAccent);
      resolve();
    }, 2000);
  });
}
