export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/styles": "styles" });
  eleventyConfig.addPassthroughCopy({ "src/art": "art" });
  eleventyConfig.addWatchTarget("../entries/");
  eleventyConfig.addWatchTarget("./lib/");
  return {
    dir: { input: "src", output: "_site", includes: "_includes" },
  };
}
