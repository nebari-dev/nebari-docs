import React from 'react';
import ReactMarkdown from 'react-markdown';
import dedent from 'dedent';

/**
 * Each row in the table is an array of cells.
 * Each cell can be either:
 *   - A single Markdown string, OR
 *   - An array of Markdown lines (which we'll join with '\n').
 */
export interface MarkdownTableProps {
    headers: string[];
    rows: Array<Array<string | string[]>>;
}

export function Table({ headers, rows }: MarkdownTableProps) {
    return (
        <table>
            <thead>
                <tr>
                    {headers.map((header, headerIdx) => (
                        <th key={headerIdx}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((rowData, rowIdx) => (
                    <tr key={rowIdx}>
                        {rowData.map((cellData, cellIdx) => {
                            // If the cellData is an array of strings, join them with "\n"
                            const cellContent = Array.isArray(cellData)
                                ? dedent(cellData.join('\n'))
                                : dedent(cellData);

                            return (
                                <td key={cellIdx}>
                                    <ReactMarkdown>{cellContent}</ReactMarkdown>
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
