import * as PIXI from "pixi.js";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { CustomEase } from "gsap/all";
gsap.registerPlugin(PixiPlugin, CustomEase);
import { replaceHash } from "./001_game_master";

import { settings } from "../SiteInterface";
export function GM_start(app: PIXI.Application): Promise<void> {
  return new Promise(async (resolve) => {
    const GM_start_container = new PIXI.Container();
    CustomEase.create("slideOutEase", "M0,0 C1.0,0 0.0,1 1,1");

    const waku_inst_rect = new PIXI.Graphics();
    waku_inst_rect.rect(-200, -200, 400, 400).stroke({
      width: 80,
      color: replaceHash(settings.colorTheme.colors.MainAccent),
    });
    waku_inst_rect.x = app.screen.width / 2;
    waku_inst_rect.y = app.screen.height / 2;
    waku_inst_rect.rotation = Math.PI / 4;
    waku_inst_rect.alpha = 0.2;
    GM_start_container.addChild(waku_inst_rect);
    gsap.fromTo(
      waku_inst_rect.scale,
      { x: 2, y: 2 },
      { x: 0.4, y: 0.4, duration: 1, ease: "slideOutEase" }
    );
    gsap.to(waku_inst_rect, {
      alpha: 0,
      duration: 0.05,
      repeat: 3,
      yoyo: true,
      ease: "none",
      delay: 0.5,
    });
    const circle_line = new PIXI.Graphics();
    circle_line.circle(0, 0, 600).stroke({
      width: 60,
      color: replaceHash(settings.colorTheme.colors.MainColor),
    });
    circle_line.x = app.screen.width / 2;
    circle_line.y = app.screen.height / 2;
    circle_line.alpha = 0.5;
    GM_start_container.addChild(circle_line);
    const rect = new PIXI.Graphics();
    rect.rect(-400, -400, 800, 800).stroke({
      width: 120,
      color: replaceHash(settings.colorTheme.colors.MainAccent),
    });
    rect.x = app.screen.width / 2;
    rect.y = app.screen.height / 2;
    rect.rotation = Math.PI / 4;
    rect.alpha = 0.3;
    GM_start_container.addChild(rect);
    const rect_two = new PIXI.Graphics();
    rect_two.rect(-500, -500, 1000, 1000).stroke({
      width: 10,
      color: replaceHash(settings.colorTheme.colors.MainColor),
    });
    rect_two.x = app.screen.width / 2;
    rect_two.y = app.screen.height / 2;
    rect_two.rotation = Math.PI / 4;
    rect_two.alpha = 0.7;
    GM_start_container.addChild(rect_two);

    const rect_three = new PIXI.Graphics();
    rect_three.circle(0, 0, 200).stroke({
      width: 40,
      color: replaceHash(settings.colorTheme.colors.MainAccent),
    });
    rect_three.x = app.screen.width / 2;
    rect_three.y = app.screen.height / 2;
    rect_three.alpha = 0.4;
    GM_start_container.addChild(rect_three);

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
    star.alpha = 0.8;
    GM_start_container.addChild(star);
    const star_two = new PIXI.Graphics();
    star_two.x = app.screen.width / 2 - 300;
    star_two.y = app.screen.height / 2 - 300;

    star_two.moveTo(0, -200);
    star_two
      .quadraticCurveTo(0, 0, 200, 0)
      .quadraticCurveTo(0, 0, 0, 200)
      .quadraticCurveTo(0, 0, -200, 0)
      .quadraticCurveTo(0, 0, 0, -200)
      .stroke({
        width: 4,
        color: replaceHash(settings.colorTheme.colors.MainAccent),
      });
    star_two.alpha = 0.8;
    GM_start_container.addChild(star_two);
    const star_three = new PIXI.Graphics();
    star_three.x = app.screen.width / 2 + 300;
    star_three.y = app.screen.height / 2 - 300;
    star_three.moveTo(0, -200);
    star_three
      .lineTo(58, -58)
      .lineTo(200, 0)
      .lineTo(58, 58)
      .lineTo(0, 200)
      .lineTo(-58, 58)
      .lineTo(-200, 0)
      .lineTo(-58, -58)
      .lineTo(0, -200)
      .stroke({
        width: 8,
        color: replaceHash(settings.colorTheme.colors.MainAccent),
      });
    star_three.alpha = 0.8;
    GM_start_container.addChild(star_three);
    const scc = new PIXI.Container();
    for (let i = 0; i < 30; i++) {
      const star_four = new PIXI.Graphics();
      star_four.x = i * 60;
      star_four.y = 200;
      star_four.moveTo(0 + 300, -200);
      star_four
        .lineTo(58 + 300, -58)
        .lineTo(200 + 300, 0)
        .lineTo(58 + 300, 58)
        .lineTo(0 + 300, 200)
        .lineTo(-58 + 300, 58)
        .lineTo(-200 + 300, 0)
        .lineTo(-58 + 300, -58)
        .lineTo(0 + 300, -200)
        .stroke({
          width: 8,
          color: replaceHash(settings.colorTheme.colors.MainAccent),
        });
      star_four.alpha = 0.8;
      star_four.scale = 0.2;
      star_four.rotation = (Math.PI / 30) * i;
      scc.addChild(star_four);
    }
    GM_start_container.addChild(scc);
    gsap.fromTo(
      star,
      { rotation: -3.14 / 4 },
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
    app.stage.addChild(GM_start_container);
    setTimeout(() => {
      app.stage.removeChild(GM_start_container);
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
    let arr_dir = { top: 0, right: 0, bottom: 0, left: 0 };
    const arr_offset = 400;
    switch (option) {
      case 0:
        arr_dir.right = arr_offset;
        break;
      case 1:
        arr_dir.right = -arr_offset;
        arr_dir.left = -arr_offset;
        break;
      case 2:
        arr_dir.top = arr_offset;
        arr_dir.bottom = arr_offset;
        break;
      case 3:
        arr_dir.top = -arr_offset;
        arr_dir.bottom = -arr_offset;
        break;
    }
    const closeFirst = new PIXI.Graphics();
    closeFirst
      .moveTo(-arr_offset, -arr_offset)
      .lineTo(app.screen.width / 2, -arr_offset + arr_dir.top)
      .lineTo(app.screen.width + arr_offset, -arr_offset)
      .lineTo(
        app.screen.width + arr_dir.right + arr_offset,
        app.screen.height / 2
      )
      .lineTo(app.screen.width + arr_offset, app.screen.height + arr_offset)
      .lineTo(
        app.screen.width / 2,
        app.screen.height + arr_dir.bottom + arr_offset
      )
      .lineTo(-arr_offset, app.screen.height + arr_offset)
      .lineTo(arr_dir.left - arr_offset, app.screen.height / 2)
      .lineTo(-arr_offset, -arr_offset)
      .fill(replaceHash(settings.colorTheme.colors.MainAccent));
    closeFirst.alpha = 0.4;
    closeFirst.position = { x: 0, y: 0 };
    app.stage.addChild(closeFirst);

    const closeSecond = new PIXI.Graphics();
    closeSecond
      .moveTo(-arr_offset, -arr_offset)
      .lineTo(app.screen.width / 2, -arr_offset + arr_dir.top)
      .lineTo(app.screen.width + arr_offset, -arr_offset)
      .lineTo(
        app.screen.width + arr_dir.right + arr_offset,
        app.screen.height / 2
      )
      .lineTo(app.screen.width + arr_offset, app.screen.height + arr_offset)
      .lineTo(
        app.screen.width / 2,
        app.screen.height + arr_dir.bottom + arr_offset
      )
      .lineTo(-arr_offset, app.screen.height + arr_offset)
      .lineTo(arr_dir.left - arr_offset, app.screen.height / 2)
      .lineTo(-arr_offset, -arr_offset)
      .fill(replaceHash(settings.colorTheme.colors.MainAccent));
    closeSecond.alpha = 0.9;
    app.stage.addChild(closeSecond);
    switch (option) {
      case 0:
        gsap.fromTo(
          closeFirst,
          { x: -app.screen.width - arr_offset - arr_offset },
          { x: 0, duration: 1.2, ease: "slideOutEase", delay: 0 }
        );

        gsap.fromTo(
          closeSecond,
          { x: -app.screen.width - arr_offset - arr_offset },
          { x: 0, duration: 1.0, ease: "slideOutEase", delay: 0.2 }
        );
        break;
      case 1:
        gsap.fromTo(
          closeFirst,
          { x: app.screen.width + arr_offset + arr_offset },
          { x: 0, duration: 1.2, ease: "slideOutEase", delay: 0 }
        );

        gsap.fromTo(
          closeSecond,
          { x: app.screen.width + arr_offset + arr_offset },
          { x: 0, duration: 1.0, ease: "slideOutEase", delay: 0.2 }
        );
        break;
      case 2:
        gsap.fromTo(
          closeFirst,
          { y: -app.screen.height - arr_offset - arr_offset },
          { y: 0, duration: 1.2, ease: "slideOutEase", delay: 0 }
        );

        gsap.fromTo(
          closeSecond,
          { y: -app.screen.height - arr_offset - arr_offset },
          { y: 0, duration: 1.0, ease: "slideOutEase", delay: 0.2 }
        );
        break;
      case 3:
        gsap.fromTo(
          closeFirst,
          { y: app.screen.height + arr_offset + arr_offset },
          { y: 0, duration: 1.2, ease: "slideOutEase", delay: 0 }
        );

        gsap.fromTo(
          closeSecond,
          { y: app.screen.height + arr_offset + arr_offset },
          { y: 0, duration: 1.0, ease: "slideOutEase", delay: 0.2 }
        );
        break;
    }

    setTimeout(() => {
      app.stage.removeChild(closeFirst);
      app.stage.removeChild(closeSecond);
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
    let arr_dir = { top: 0, right: 0, bottom: 0, left: 0 };
    const arr_offset = 400;
    switch (option) {
      case 0:
        arr_dir.right = arr_offset;
        arr_dir.left = arr_offset;
        break;
      case 1:
        arr_dir.right = -arr_offset;
        arr_dir.left = -arr_offset;
        break;
      case 2:
        arr_dir.top = arr_offset;
        arr_dir.bottom = arr_offset;
        break;
      case 3:
        arr_dir.top = -arr_offset;
        arr_dir.bottom = -arr_offset;
        break;
    }
    const openFirst = new PIXI.Graphics();
    openFirst
      .moveTo(-arr_offset, -arr_offset)
      .lineTo(app.screen.width / 2, -arr_offset + arr_dir.top)
      .lineTo(app.screen.width + arr_offset, -arr_offset)
      .lineTo(
        app.screen.width + arr_dir.right + arr_offset,
        app.screen.height / 2
      )
      .lineTo(app.screen.width + arr_offset, app.screen.height + arr_offset)
      .lineTo(
        app.screen.width / 2,
        app.screen.height + arr_dir.bottom + arr_offset
      )
      .lineTo(-arr_offset, app.screen.height + arr_offset)
      .lineTo(arr_dir.left - arr_offset, app.screen.height / 2)
      .lineTo(-arr_offset, -arr_offset)
      .fill(replaceHash(settings.colorTheme.colors.MainAccent));
    openFirst.position = { x: 0, y: 0 };
    openFirst.alpha = 0.4;
    app.stage.addChild(openFirst);
    const openSecond = new PIXI.Graphics();
    openSecond
      .moveTo(-arr_offset, -arr_offset)
      .lineTo(app.screen.width / 2, -arr_offset + arr_dir.top)
      .lineTo(app.screen.width + arr_offset, -arr_offset)
      .lineTo(
        app.screen.width + arr_dir.right + arr_offset,
        app.screen.height / 2
      )
      .lineTo(app.screen.width + arr_offset, app.screen.height + arr_offset)
      .lineTo(
        app.screen.width / 2,
        app.screen.height + arr_dir.bottom + arr_offset
      )
      .lineTo(-arr_offset, app.screen.height + arr_offset)
      .lineTo(arr_dir.left - arr_offset, app.screen.height / 2)
      .lineTo(-arr_offset, -arr_offset)
      .fill(replaceHash(settings.colorTheme.colors.MainAccent));
    openSecond.alpha = 0.9;
    app.stage.addChild(openSecond);
    switch (option) {
      case 0:
        gsap.fromTo(
          openSecond,
          { x: 0 },
          {
            x: app.screen.width + arr_offset,
            duration: 1.2,
            ease: "slideOutEase",
            delay: 0,
          }
        );
        gsap.fromTo(
          openFirst,
          { x: 0 },
          {
            x: app.screen.width + arr_offset,
            duration: 1.0,
            ease: "slideOutEase",
            delay: 0.2,
          }
        );
        break;
      case 1:
        gsap.fromTo(
          openSecond,
          { x: 0 },
          {
            x: -app.screen.width - arr_offset,
            duration: 1.2,
            ease: "slideOutEase",
            delay: 0,
          }
        );
        gsap.fromTo(
          openFirst,
          { x: 0 },
          {
            x: -app.screen.width - arr_offset,
            duration: 1.0,
            ease: "slideOutEase",
            delay: 0.2,
          }
        );
        break;
      case 2:
        gsap.fromTo(
          openSecond,
          { y: 0 },
          {
            y: app.screen.height + arr_offset,
            duration: 1.2,
            ease: "slideOutEase",
            delay: 0,
          }
        );
        gsap.fromTo(
          openFirst,
          { y: 0 },
          {
            y: app.screen.height + arr_offset,
            duration: 1.0,
            ease: "slideOutEase",
            delay: 0.2,
          }
        );

        break;
      case 3:
        gsap.fromTo(
          openSecond,
          { y: 0 },
          {
            y: -app.screen.height - arr_offset,
            duration: 1.2,
            ease: "slideOutEase",
            delay: 0,
          }
        );
        gsap.fromTo(
          openFirst,
          { y: 0 },
          {
            y: -app.screen.height - arr_offset,
            duration: 1.0,
            ease: "slideOutEase",
            delay: 0.2,
          }
        );
        break;
    }

    setTimeout(() => {
      app.stage.removeChild(openFirst);
      app.stage.removeChild(openSecond);
      resolve();
    }, 1200);
  });
}
