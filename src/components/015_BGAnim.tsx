import React from "react";
import "../styles/013_BGAnim.css";
import OuterStarSvg from "../svg_conponent/001_Outer_star";
import OuterCircleSvg from "../svg_conponent/002_Outer_circ";
import OuterSpearSvg from "../svg_conponent/003_Outer_Spear";
import OuterLineRepeatSvg from "../svg_conponent/004_Outer_Line_repeat";
import InnerStarsSvg from "../svg_conponent/005_Inner_stars";
import InnerSpearSvg from "../svg_conponent/006_Inner_Spear";
import InnerLineSplitSvg from "../svg_conponent/007_Inner_Line_split";
import InnerLineRepeatSvg from "../svg_conponent/008_Inner_Line_repeat";
import CenterStarsSvg from "../svg_conponent/009_Center_Stars";
import CenterLineSplitSvg from "../svg_conponent/010_Center_Line_Split";
import CenterCrownSvg from "../svg_conponent/011_Center_Crown";

export const SVG_RATIOS = {
  OuterStar: 3705.55 / 4320, // 0.8578
  OuterCircle: 4320 / 4320, // 1.0000 (基準値)
  OuterSpear: 3155.5 / 4320, // 0.7305
  OuterLineRepeat: 3601 / 4320, // 0.8336
  InnerStars: 1251.52 / 4320, // 0.2897
  InnerSpear: 2176.16 / 4320, // 0.5037
  InnerLineSplit: 1357 / 4320, // 0.3141
  InnerLineRepeat: 1800.28 / 4320, // 0.4168
  CenterStars: 779.65 / 4320, // 0.1805
  CenterLineSplit: 1004 / 4320, // 0.2324
  CenterCrown: 615 / 4320, // 0.1424
};
const general_svg_size = 1000;

const BGAnim: React.FC = () => {
  return (
    <div className="BG-anim" style={{ zIndex: 2 }}>
      <OuterStarSvg
        size={general_svg_size * SVG_RATIOS.OuterStar}
        className="BG-svg"
      />
      <OuterCircleSvg
        size={general_svg_size * SVG_RATIOS.OuterCircle}
        className="BG-svg"
      />
      <OuterSpearSvg
        size={general_svg_size * SVG_RATIOS.OuterSpear}
        className="BG-svg"
      />
      <OuterLineRepeatSvg
        size={general_svg_size * SVG_RATIOS.OuterLineRepeat}
        className="BG-svg"
      />
      <InnerStarsSvg
        size={general_svg_size * SVG_RATIOS.InnerStars}
        className="BG-svg"
      />
      <InnerSpearSvg
        size={general_svg_size * SVG_RATIOS.InnerSpear}
        className="BG-svg"
      />
      <InnerLineSplitSvg
        size={general_svg_size * SVG_RATIOS.InnerLineSplit}
        className="BG-svg"
      />
      <InnerLineRepeatSvg
        size={general_svg_size * SVG_RATIOS.InnerLineRepeat}
        className="BG-svg"
      />
      <CenterStarsSvg
        size={general_svg_size * SVG_RATIOS.CenterStars}
        className="BG-svg"
      />
      <CenterLineSplitSvg
        size={general_svg_size * SVG_RATIOS.CenterLineSplit}
        className="BG-svg"
      />
      <CenterCrownSvg
        size={general_svg_size * SVG_RATIOS.CenterCrown}
        className="BG-svg"
      />
    </div>
  );
};

export default BGAnim;
