import * as React from "react";
import { classes, cssRule, media, style, types } from "typestyle";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type CSSProps = Omit<types.NestedCSSProperties, "$debugName">;

export function styles(s: CSSProps): CSSProps {
    return s;
}

export function component<Tag extends keyof JSX.IntrinsicElements>(
    $debugName: string,
    tag: Tag,
    ...styles: CSSProps[]
): React.FunctionComponent<JSX.IntrinsicElements[Tag]> {
    const styleClassName = style({ $debugName }, ...styles);
    return ({ className, ...props }: any) => {
        return React.createElement(tag, {
            className: classes(className, styleClassName),
            ...props,
        });
    };
}

export function mobile(...styles: CSSProps[]): CSSProps {
    return media({ maxWidth: 700 }, ...styles);
}

export function darkMode(styles: CSSProps): CSSProps {
    return {
        $nest: {
            "@media (prefers-color-scheme: dark)": styles,
        },
    };
}

cssRule("body", {
    fontFamily: `"Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif`,
    fontSize: 16,
    lineHeight: 1.5,
});

cssRule("body pre, body code", {
    fontFamily: "'Ubuntu Mono', monospace",
});

cssRule("h1, h2, h3, h4, h5, h6", {
    fontFamily: "'Open Sans', sans-serif",
});

cssRule(
    "h2, h3",
    {
        marginLeft: -20,
        marginTop: "2em",
        marginBottom: "0.5em",
    },
    mobile({ marginLeft: 0 }),
);

cssRule(
    "body h1",
    {
        color: "#6272a4",
        margin: 0,
        paddingBottom: 20,
        paddingTop: 25,
        marginLeft: -20,
    },
    darkMode({
        color: "#919dc0",
        textShadow: "1px 1px 2px #1c1e26",
    }),
    mobile({ marginLeft: 0 }),
);
