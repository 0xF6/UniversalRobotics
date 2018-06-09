import * as React from "react"
import * as ReactDOM from "react-dom"
import { RootComponent } from "./root-component"
import { webFrame } from "electron"
import { css } from "glamor"

import "glamor/reset"


css.global("html, body", {
    // turn off text highlighting
    userSelect: "none",
  
    // reset the cursor pointer
    cursor: "default",
  
    // font
    font: "caption",
    // text rendering
    //WebkitFontSmoothing: "subpixel-antialiased",
    textRendering: "auto",
  });
  
/**
 * Zooming resets
 */
webFrame.setVisualZoomLevelLimits(1, 1)
webFrame.setLayoutZoomLevelLimits(0, 0)

/**
 * Drag and drop resets
 */
document.addEventListener("dragover", event => event.preventDefault())
document.addEventListener("drop", event => event.preventDefault())

// mount the root component
ReactDOM.render(<RootComponent />, document.getElementById("root"))

setTimeout(() => {
    ReactDOM.render(
        <div>
            sasat
        </div>, document.getElementById("root"))
}, 12000);