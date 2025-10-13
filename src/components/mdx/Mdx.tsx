import Link from 'next/link'
import Image from 'next/image'
import {MDXRemote} from 'next-mdx-remote/rsc'
import {highlight} from 'sugar-high'
import React, {PropsWithChildren, ReactNode} from 'react'

function Table({data}: { data: { headers: never[], rows: never[][] } }) {
    const headers = data.headers.map((header, index) => (
        <th key={index}>{header}</th>
    ))
    const rows = data.rows.map((row, index) => (
        <tr key={index}>
            {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
            ))}
        </tr>
    ))

    return (
        <table>
            <thead>
            <tr>{headers}</tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    )
}

function CustomLink(props: PropsWithChildren & { href: string, children: ReactNode }) {
    const href = props.href

    if (href.startsWith('/')) {
        return (
            <Link {...props} href={href}>
                {props.children}
            </Link>
        )
    }

    if (href.startsWith('#')) {
        return <a {...props} />
    }

    return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function RoundedImage(props: PropsWithChildren & { alt: string, src: string, width: number, height: number }) {
    return <Image {...props} alt={props.alt} className="rounded-lg" />
}

function Code({children, ...props}: { children: never, props: never }) {
    const codeHTML = highlight(children)
    return <code dangerouslySetInnerHTML={{__html: codeHTML}} {...props} />
}

function slugify(str: string) {
    return str
        .toString()
        .toLowerCase()
        .trim() // Remove whitespace from both ends of a string
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

function createHeading(level: number) {
    const Heading = ({children}: { children: string }) => {
        const slug = slugify(children)
        return React.createElement(
            `h${level}`,
            {id: slug},
            [
                React.createElement('a', {
                    href: `#${slug}`,
                    key: `link-${slug}`,
                    className: 'anchor',
                }),
            ],
            children
        )
    }

    Heading.displayName = `Heading${level}`

    return Heading
}

const components = {
    h1: createHeading(1),
    h2: createHeading(2),
    h3: createHeading(3),
    h4: createHeading(4),
    h5: createHeading(5),
    h6: createHeading(6),
    Image: RoundedImage,
    a: CustomLink,
    code: Code,
    Table,
}

export function CustomMDX(props: PropsWithChildren & { source: string }) {
    return (
        <MDXRemote
            {...props}
            components={{...components}}
        />
    )
}

export function getHeadingsFromMDX(content: string) {
    const headingRegex = /^(#{1,6})\s+(.*)$/gm;
    const headings = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2];
        const slug = text.toLowerCase().replace(/\s+/g, "-");
        headings.push({level, text, id: slug});
    }

    return headings
}
