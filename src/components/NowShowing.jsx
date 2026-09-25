import { useTmdb } from "../api";
import { reducedMotion } from "../theme";
import ScrollVelocity from "./bits/ScrollVelocity";

// Marquee sign of this week's trending titles. Decorative: the titles are reachable elsewhere.
export default function NowShowing() {
  const { data } = useTmdb("/trending/movie/week");
  const text = data?.results.slice(0, 12).map((m) => m.title).join("  ✦  ");
  if (!text) return null;
  return (
    <div className="marquee-band" aria-hidden="true">
      {reducedMotion
        ? <p className="marquee-scroller marquee-static">{text}</p>
        : <ScrollVelocity texts={[`${text}  ✦  `]} velocity={35} numCopies={3}
            parallaxClassName="marquee" scrollerClassName="marquee-scroller" />}
    </div>
  );
}
