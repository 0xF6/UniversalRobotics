import * as React from "react"

var cubes = [];

for (var i=1; i!=10; i++) {
    let className = `sk-cube sk-cube${i}`
    cubes.push(React.createElement('div', {className: className}));
}

export class StartScreen extends React.Component<{}, {}> {
    render() {
      return (
        <div id="startScreen">
            <div className="page-content-wrapper">
                <div id="pageContent">
                    <h1>Loading...</h1>
                    <div className="sk-cube-grid">
                        {cubes}
                    </div>
                </div>
            </div>
        </div>
      )
    }
  }