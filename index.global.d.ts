declare module "*.jpeg"
declare module "*.jpg"
declare module "*.gif"
declare module "*.png"
declare module "*.svg"
declare module "*.json"

declare module "electron-window-state-manager" {
    import { BrowserWindow } from "electron"
  
    interface ElectronStateManagerOptions {
      /** The default width for this window. */
      defaultWidth?: number
      /** The default height for this window. */
      defaultHeight?: number
    }
  
    /**
     * Manages an Electron.BrowserWindow's dimensions and stores it to disk.
     */
    class ElectronStateManager {
      /**
       * Creates a manager that loads/saves a window's coordinates & dimensions.
       *
       * @param name The name of the window.
       * @param options Some default options.
       */
      constructor(name: string, options?: ElectronStateManagerOptions)
      /** Save this window's dimensions */
      saveState(browserWindow: BrowserWindow): void
      /** The window width. */
      width: number
      /** The window height. */
      height: number
      /** the window left position. */
      x: number
      /** The window right position. */
      y: number
      /** Is this maximized? */
      maximized: boolean
    }
  
    export = ElectronStateManager
}
declare module "popmotion-react" {
    import { Component } from "react"
  
    export interface StateChangeValue {
      [name: string]: any
    }
  
    export interface SetStateFunctions {
      [name: string]: () => void
    }
  
    export interface MotionStateProps {
      /** The current numerical value, or object of named values. */
      v: number | StateChangeValue
  
      /** Current velocity, or object of named velocities. */
      velocity: number
  
      /** Current state name. */
      state: string
  
      /** Object of setter functions, generated from the states defined in onStateChange (each optionally accepts an Event). */
      setStateTo: SetStateFunctions
  
      /** Provides onStateChange setters a ref attribute for an escape hatch to the DOM (for instance attaching/removing events). */
      setRef(ref: React.ReactNode): void
    }
  
    export interface StateChangeEvent {
      /** The popmotion value object. */
      value: any
      /** State before current state change. */
      previousState: string
      /** Object of state setters (each optionally accepts an Event). */
      setStateTo: any
      /** : A reference to the mounted React component, if a component was provided setRef. */
      ref: React.ReactNode
      /** The triggering event, if a state setter was called with one. */
      e: Event
      /** When hooking into TransitionGroup lifecycle events componentWillEnter, componentWillAppear and componentWillLeave, this callback is provided and required. */
      onComplete?: () => void
    }
  
    export interface MotionStates {
      [stateName: string]: (onStateChange: StateChangeEvent) => void
    }
  
    export interface MotionValueProps {
      /**
       * The initial state to start in.
       */
      initialState?: string
  
      /**
       * A state machine mapping state names to action states.
       */
      onStateChange?: MotionStates
    }
  
    export class MotionValue extends Component<MotionValueProps, {}> {
      constructor()
    }
}