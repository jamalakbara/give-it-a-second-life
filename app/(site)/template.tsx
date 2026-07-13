import { ViewTransition } from "react";

// A template (unlike a layout) re-mounts on every navigation, so the wrapped
// content genuinely enters/exits per route change — which is what activates the
// <ViewTransition> enter/exit animations. Placing this in the layout instead
// would make each nav an "update" of a persistent element and nothing animates.
//
// Untyped navs fall back to `fade-rise`; links that carry a `transitionTypes`
// of `nav-forward` / `nav-back` (see Navbar, CardMedia, the item "← Gallery"
// link) get the directional blur-slide. All rules live in app/globals.css.
export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransition
      default="fade-rise"
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "fade-rise",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "fade-rise",
      }}
    >
      {children}
    </ViewTransition>
  );
}
