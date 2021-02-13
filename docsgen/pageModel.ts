import { Node, Parser } from "commonmark";
import { readFileSync } from "fs";
import { basename } from "path";
import { createNodeId, getNodeText, nextStep, walkMarkdown } from "./markdownUtils";

const parser = new Parser();

export interface PageSection {
    level: number;
    node: Node;
    id: string;
}

export class PageModel {
    public static from(path: string): PageModel {
        const name = basename(path, ".md");
        const source = readFileSync(path, { encoding: "utf-8" });
        const root = parser.parse(source);
        return new PageModel(name, root, getTitle(root), getSections(root));
    }

    constructor(
        public readonly name: string,
        public readonly root: Node,
        public readonly title: string,
        public readonly sections: ReadonlyArray<PageSection>,
    ) {}

    public get path(): string {
        return `${this.name}.html`;
    }
}

function getTitle(root: Node): string {
    const fallback = "Untitled";
    const walker = root.walker();

    const maybeDocument = nextStep(walker);
    if (maybeDocument === null || maybeDocument.node.type !== "document") {
        return fallback;
    }

    const maybeHeading = nextStep(walker);
    if (maybeHeading === null || maybeHeading.node.type !== "heading" || maybeHeading.node.level !== 1) {
        return fallback;
    }

    return getNodeText(maybeHeading.node);
}

function getSections(root: Node): PageSection[] {
    let sections: PageSection[] = [];
    walkMarkdown(root, node => {
        if (node.type === "heading" && node.level !== 1) {
            sections.push(getSection(node));
        }
    });
    return sections;
}

function getSection(node: Node): PageSection {
    return {
        node,
        level: node.level,
        id: createNodeId(node),
    };
}
