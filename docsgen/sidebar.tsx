import * as React from "react";
import { classes, style } from "typestyle";
import { MarkdownChildren } from "./markdown";
import { PageModel } from "./pageModel";
import { component, darkMode, mobile, styles } from "./style";

interface SidebarProps {
    pages: PageModel[];
    selectedIndex: number;
}

export const Sidebar: React.FunctionComponent<SidebarProps> = ({ pages, selectedIndex }) => {
    const pageSections = pages[selectedIndex].sections.filter(({ level }) => level <= 3).map(({ id, node, level }) => {
        const className = classes(level === 2 && section, level === 3 && subsection);
        return (
            <SectionLink key={id} href={`#${id}`} className={className}>
                <MarkdownChildren root={node} />
            </SectionLink>
        );
    });

    const links = pages.map((page, index) => {
        const isSelected = index === selectedIndex;
        const className = classes(index === 0 ? homeLink : pageLink, isSelected && selectedPage);
        const hash = isSelected ? "#top" : "";
        return (
            <LinkSection key={page.name}>
                <PageLink href={`${page.path}${hash}`} className={className}>
                    {page.title}
                </PageLink>
                {isSelected ? pageSections : null}
            </LinkSection>
        );
    });

    return (
        <Container>
            {links}
            <PageLink
                className={selectedPage}
                href="https://github.com/jscheiny/safe-units"
                rel="noreferrer"
                target="_blank"
            >
                <GithubIcon src="images/github-icon.png" /> View on GitHub
            </PageLink>
        </Container>
    );
};

const HOME_COLOR = "#6272a4";
const LINK_COLOR = "#293742";

const Container = component(
    "sidebar",
    "div",
    {
        minWidth: 250,
        fontSize: 14,
        overflow: "auto",
    },
    darkMode({
        background: "#272a35",
    }),
    mobile({ overflow: "visible" }),
);

const link = styles({
    display: "block",
    color: "#293742",
    textDecoration: "none",
});

const PageLink = component(
    "page-link",
    "a",
    {
        ...link,
        margin: "5px 0",
        padding: "5px 10px",
        background: "#E1E8ED",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        $nest: {
            "&:hover": {
                background: "#BFCCD6",
            },
        },
    },
    darkMode({
        color: "#E1E8ED",
        background: "#1C1E26",
        $nest: {
            "&:hover": {
                background: "#323643",
            },
        },
    }),
    mobile({ display: "block" }),
);

const homeLink = style(
    {
        color: HOME_COLOR,
    },
    darkMode({ color: "#919dc0" }),
);

const pageLink = style({
    color: LINK_COLOR,
});

const selectedPageStyles = styles({
    color: "#F5F8FA",
    background: HOME_COLOR,
    $nest: {
        "&:hover": {
            background: HOME_COLOR,
            color: "#CED9E0",
        },
    },
});

const selectedPage = style(selectedPageStyles, darkMode(selectedPageStyles));

const SectionLink = component(
    "section-link",
    "a",
    {
        ...link,
        color: LINK_COLOR,
        $nest: {
            "&:hover": {
                background: "#E1E8ED",
            },
        },
    },
    darkMode({
        color: "#E1E8ED",
        $nest: {
            "&:hover": {
                background: HOME_COLOR,
            },
        },
    }),
    mobile({ display: "none" }),
);

const section = style({
    $debugName: "section",
    padding: "3px 20px",
});

const subsection = style({
    $debugName: "subsection",
    padding: "3px 40px",
    color: "#5C7080",
});

const LinkSection = component(
    "links",
    "div",
    {
        $nest: {
            "&:last-child": {
                marginBottom: 20,
            },
            "&:first-child": {
                marginTop: 20,
            },
        },
    },
    mobile({
        $nest: {
            "&:last-child": {
                marginBottom: 0,
            },
            "&:first-child": {
                marginTop: 0,
            },
        },
    }),
);

const GithubIcon = component("links", "img", {
    width: 14,
    height: 14,
    marginRight: 5,
});
