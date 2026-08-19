import { shell } from "../lib/render.js";
import { u } from "../lib/entries.js";

export const data = { permalink: "/index.html" };

export function render() {
  return shell({
    title: "The Wake Encyclopedia",
    bodyClass: "title-page",
    nav: "",
    main: `<main id="main">
<blockquote>&ldquo;Numbers don&rsquo;t lie; but liars love numbers.&rdquo;</blockquote>
<a class="enter" href="${u("/index/")}">Enter</a>
</main>`,
  });
}
