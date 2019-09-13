export const url = "https://api.qwikinsights.com";

export const csrf_tokens = JSON.parse(window.localStorage.getItem("csrf-qwikinsights")) || {};

export const darkmode = JSON.parse(window.localStorage.getItem("darkmode-qwikinsights")) || {mode: ""};
