import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { basename, extname, join } from "path";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { getStyles } from "typestyle";
import { Page } from "./page";
import { PageModel } from "./pageModel";

const renderPageHtml = (title: string, body: string, inlineStyles: string, linkedStyles: string) => `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>${inlineStyles}</style>
        ${linkedStyles}
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Ubuntu+Mono" rel="stylesheet">
    </head>
    <body>${body}</body>
</html>`;

const docsDir = "docs";
const buildDir = join(docsDir, "build");
if (!existsSync(buildDir)) {
    mkdirSync(buildDir);
}

const stylesDir = join(buildDir, "styles");
if (!existsSync(stylesDir)) {
    mkdirSync(stylesDir);
}

const imagesContextPath = "images";
const imagesInDir = join(docsDir, imagesContextPath);
const imagesOutDir = join(buildDir, imagesContextPath);
if (!existsSync(imagesOutDir)) {
    mkdirSync(imagesOutDir);
}

const pages = readdirSync("docs")
    .filter(path => extname(path) === ".md")
    .map(path => join("docs", path))
    .map(PageModel.from);

const orderPath = join("docs", "order.txt");
let order: string[] = [];
if (existsSync(orderPath) && !statSync(orderPath).isDirectory()) {
    order = readFileSync(orderPath, { encoding: "utf8" }).split("\n");
}

function orderBy(order: string[]): (a: PageModel, b: PageModel) => number {
    const getIndex = (page: PageModel) => {
        if (page.name === "index") {
            return -Infinity;
        }
        let index = order.indexOf(page.name);
        if (index === -1) {
            index = order.indexOf("*");
        }
        return index === -1 ? Infinity : index;
    };

    return (a, b) => {
        const aIndex = getIndex(a);
        const bIndex = getIndex(b);
        if (aIndex < bIndex) {
            return -1;
        } else if (aIndex > bIndex) {
            return 1;
        } else {
            return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
        }
    };
}

function buildLinkedStyles(inPath: string): string {
    const name = basename(inPath);
    const outPath = join(stylesDir, name);
    copyFileSync(inPath, outPath);
    return `<link rel="stylesheet" type="text/css" media="screen" href="styles/${name}" />`;
}

const linkedStyles = ["docs/styles/highlight.css", "node_modules/normalize.css/normalize.css"]
    .map(buildLinkedStyles)
    .join("\n");

readdirSync(imagesInDir).forEach(path => {
    const inPath = join(imagesInDir, path);
    const outPath = join(imagesOutDir, path);
    copyFileSync(inPath, outPath);
});

pages.sort(orderBy(order));
pages.forEach((page, index) => {
    const body = ReactDOMServer.renderToString(<Page pages={pages} pageIndex={index} />);
    const title = page.name === "index" ? page.title : `${page.title} | Safe Units`;
    const html = renderPageHtml(title, body, getStyles(), linkedStyles);
    writeFileSync(join(buildDir, page.path), html);
});
