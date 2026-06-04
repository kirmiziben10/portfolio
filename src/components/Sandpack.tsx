import React from "react";
import "./Sandpack.css";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

import cssContent from "../sandpacks/reveal/style.css?raw";
import jsContent from "../sandpacks/reveal/script.js?raw";

function SandpackWindow() {
  return (
    // add theme="auto" later if you implement themes.
    <SandpackProvider
      template="react"
      options={{ bundlerURL: "https://sandpack-bundler.codesandbox.io" }}
      files={{
        '/App.js': jsContent,
        '/styles.css': cssContent
      }}
    >
      <SandpackLayout>
        <SandpackPreview 
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
        />
      </SandpackLayout>
    </SandpackProvider>
  );
}

export default SandpackWindow;
