import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownTableProps {
    headers: string[];
    rows: string[][];
}

export const MarkdownTable: FC<MarkdownTableProps> = ({ headers, rows }) => {
    return (
        <table>
        <thead>
        <tr>
        {
            headers.map((headerText, headerIdx) => (
                <th key= { headerIdx } > { headerText } </th>
            ))
        }
        </tr>
        </thead>
        <tbody>
        {
        rows.map((rowData, rowIdx) => (
            <tr key= { rowIdx } >
            {
                rowData.map((cellContent, cellIdx) => (
                    <td key= { cellIdx } >
                    <ReactMarkdown>{ cellContent } </ReactMarkdown>
                    </td>
                ))
    }
    </tr>
        ))}
</tbody>
    </table>
  );
};
