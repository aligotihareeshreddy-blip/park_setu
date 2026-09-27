import { useEffect } from "react";

const DEFAULTS = {
  title: "ParkSetu | Find verified parking spaces in Bengaluru",
  description: "Find verified parking spaces near you with ParkSetu. Compare parking type, vehicle suitability, facilities, pricing and availability.",
};

export default function Seo({ title, description = DEFAULTS.description, path = "/", image }) {
  useEffect(() => {
    const pageTitle = title || DEFAULTS.title;
    document.title = pageTitle;
    const setMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    const setProperty = (property, content) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", property); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", description);
    setMeta("robots", "index,follow,max-image-preview:large");
    setProperty("og:title", pageTitle);
    setProperty("og:description", description);
    setProperty("og:type", "website");
    setProperty("og:site_name", "ParkSetu");
    setProperty("og:url", `${window.location.origin}${path}`);
    if (image) setProperty("og:image", image);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", pageTitle);
    setMeta("twitter:description", description);
    if (image) setMeta("twitter:image", image);
    let canonical = document.querySelector("link[rel=canonical]");
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = `${window.location.origin}${path}`;
  }, [title, description, path]);
  return null;
}
