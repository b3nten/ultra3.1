import App from "./src/app.tsx"
import React from "react"
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('app');
const root = createRoot(domNode);
root.render(React.createElement(App));