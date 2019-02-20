import { renderToString, renderToStaticMarkup } from 'react-dom/server';

import { scriptGenerator } from './scriptGenerator.ts';
import { jsxDom } from './viewerDom';

function renderHtml (requestJson) {
    // Separate nodes from connectors
    const allNodes = {...requestJson.nodes};
    const allConnections = [...requestJson.connectors];

    // Render HTML
    const jsx = jsxDom(allNodes);
    const jsxString = renderToStaticMarkup(jsx);

    // Generate Scripts
    console.time("Script Parser");
    const script = scriptGenerator(allNodes, allConnections);
    console.timeEnd("Script Parser");
    let scripts = `<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.bundle.min.js"></script>\n`;
    scripts += `<script>${script[0]}${script[1]}</script>`;
    
    // Combine former results
    const scriptedHtml = jsxString.slice(0, jsxString.length - 6) + scripts + "</div>";
    
    // Return generated HTML as a string
    return scriptedHtml;
}

export function renderSignals (requestJson) {
    return renderHtml(requestJson);
}