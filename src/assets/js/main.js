import { jarallax } from "jarallax";
import AOS from "aos";
import { isCrawlerUserAgent } from "is-web-crawler";

// Global
window.ns = {
  height: 0,
};

ns.parralax = () => {
  jarallax(document.querySelectorAll(".intro__image"), {
    speed: 0.8,
    automaticResize: true,
  });
  jarallax(document.querySelectorAll(".contact__image"), {
    speed: 0.8,
    automaticResize: true,
  });
  jarallax(document.querySelectorAll(".parallax-image"), {
    speed: 0.8,
    automaticResize: true,
  });
};

/**
 * Document Load
 */
document.addEventListener("DOMContentLoaded", () => {
  // // No JS Support
  // var html = document.getElementsByTagName("html")[0];
  // if (html.classList.contains("no-js")) {
  //   html.classList.remove("no-js");
  //   html.classList.add("js");
  // }
});

// /**
//  * Window Load
//  */

window.onload = () => {
  ns.parralax();
  AOS.init({ offset: 100, once: false, disable: isCrawlerUserAgent() });
};
