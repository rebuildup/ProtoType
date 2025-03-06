import * as PIXI from "pixi.js";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { CustomEase } from "gsap/all";
gsap.registerPlugin(PixiPlugin, CustomEase);
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
export function closeScene(
  app: PIXI.Application,
  option: number
): Promise<void> {
  return new Promise(async (resolve) => {
    CustomEase.create("slideOutEase", "M0,0 C1.0,0 0.0,1.33 1,1");
    const closeSecond = new PIXI.Graphics();
    closeSecond
      .rect(0, 0, app.screen.width, app.screen.height)
      .fill(replaceHash(settings.colorTheme.colors.MainAccent));
    closeSecond.alpha = 0.8;
    closeSecond.position = { x: 0, y: 0 };
    app.stage.addChild(closeSecond);

    const closeAccent = new PIXI.Graphics();
    closeAccent
      .rect(0, 0, app.screen.width, app.screen.height)
      .fill(replaceHash(settings.colorTheme.colors.MainAccent));
    app.stage.addChild(closeAccent);
    switch (option) {
      case 0:
        gsap.fromTo(
          closeSecond,
          { x: -app.screen.width },
          { x: 0, duration: 1.2, ease: "slideOutEase", delay: 0 }
        );

        gsap.fromTo(
          closeAccent,
          { x: -app.screen.width },
          { x: 0, duration: 1.0, ease: "slideOutEase", delay: 0.2 }
        );
        break;
      case 1:
        gsap.fromTo(
          closeSecond,
          { x: app.screen.width },
          { x: 0, duration: 1.2, ease: "slideOutEase", delay: 0 }
        );

        gsap.fromTo(
          closeAccent,
          { x: app.screen.width },
          { x: 0, duration: 1.0, ease: "slideOutEase", delay: 0.2 }
        );
        break;
      case 2:
        gsap.fromTo(
          closeSecond,
          { y: -app.screen.height },
          { y: 0, duration: 1.2, ease: "slideOutEase", delay: 0 }
        );

        gsap.fromTo(
          closeAccent,
          { y: -app.screen.height },
          { y: 0, duration: 1.0, ease: "slideOutEase", delay: 0.2 }
        );
        break;
      case 3:
        gsap.fromTo(
          closeSecond,
          { y: app.screen.height },
          { y: 0, duration: 1.2, ease: "slideOutEase", delay: 0 }
        );

        gsap.fromTo(
          closeAccent,
          { y: app.screen.height },
          { y: 0, duration: 1.0, ease: "slideOutEase", delay: 0.2 }
        );
        break;
    }

    setTimeout(() => {
      app.stage.removeChild(closeSecond);
      app.stage.removeChild(closeAccent);
      resolve();
    }, 750);
  });
}
export function openScene(
  app: PIXI.Application,
  option: number
): Promise<void> {
  return new Promise(async (resolve) => {
    CustomEase.create("slideOutEase", "M0,0 C1.0,0 0.0,1.33 1,1");
    const openSecond = new PIXI.Graphics();
    openSecond
      .rect(0, 0, app.screen.width, app.screen.height)
      .fill(replaceHash(settings.colorTheme.colors.MainAccent));
    openSecond.position = { x: 0, y: 0 };
    openSecond.alpha = 0.8;
    app.stage.addChild(openSecond);
    const openAccent = new PIXI.Graphics();
    openAccent
      .rect(0, 0, app.screen.width, app.screen.height)
      .fill(replaceHash(settings.colorTheme.colors.MainAccent));

    app.stage.addChild(openAccent);
    switch (option) {
      case 0:
        gsap.fromTo(
          openAccent,
          { x: 0 },
          {
            x: app.screen.width,
            duration: 1.2,
            ease: "slideOutEase",
            delay: 0,
          }
        );
        gsap.fromTo(
          openSecond,
          { x: 0 },
          {
            x: app.screen.width,
            duration: 1.0,
            ease: "slideOutEase",
            delay: 0.2,
          }
        );
        break;
      case 1:
        gsap.fromTo(
          openAccent,
          { x: 0 },
          {
            x: -app.screen.width,
            duration: 1.2,
            ease: "slideOutEase",
            delay: 0,
          }
        );
        gsap.fromTo(
          openSecond,
          { x: 0 },
          {
            x: -app.screen.width,
            duration: 1.0,
            ease: "slideOutEase",
            delay: 0.2,
          }
        );
        break;
      case 2:
        gsap.fromTo(
          openAccent,
          { y: 0 },
          {
            y: app.screen.height,
            duration: 1.2,
            ease: "slideOutEase",
            delay: 0,
          }
        );
        gsap.fromTo(
          openSecond,
          { y: 0 },
          {
            y: app.screen.height,
            duration: 1.0,
            ease: "slideOutEase",
            delay: 0.2,
          }
        );

        break;
      case 3:
        gsap.fromTo(
          openAccent,
          { y: 0 },
          {
            y: -app.screen.height,
            duration: 1.2,
            ease: "slideOutEase",
            delay: 0,
          }
        );
        gsap.fromTo(
          openSecond,
          { y: 0 },
          {
            y: -app.screen.height,
            duration: 1.0,
            ease: "slideOutEase",
            delay: 0.2,
          }
        );
        break;
    }

    setTimeout(() => {
      app.stage.removeChild(openSecond);
      app.stage.removeChild(openAccent);
      resolve();
    }, 750);
  });
}
