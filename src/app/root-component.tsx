import * as React from "react"
import { compose } from "glamor"
import { styles, colors } from "./../views/theme"
import { StartScreen } from "../views/welcome-screen/welcome-screen";

const ROOT = compose(styles.fullScreen, {
  background: colors.window.background,
  "& ::-webkit-scrollbar": { backgroundColor: colors.scrollbar.base, width: 12, height: 12 },
  "& ::-webkit-scrollbar-track": { backgroundColor: colors.scrollbar.track },
  "& ::-webkit-scrollbar-thumb": { backgroundColor: colors.scrollbar.thumb, borderRadius: 4 },
})

export class RootComponent extends React.Component<{}, {}> {
  render() {
    return (
      <div {...ROOT}>
        <StartScreen/>
      </div>
    )
  }
}