# 🌀 UR5 ⚙️ - TypeScript Platform 🚀

### Dependences 🌜
1. Yarn 1.6 or above
2. NodeJS 9.0 or above
3. TypeScript 2.6 or above (in global)
4. Mocha 5.1 or above (in global)


### Hardware 🔥

1. PolyScope 1.8
2. URController 1.8

### Install 💦 
1. Create `config.ts`
2. Copy class for `config.example.ts` to `config.ts`
3. Set `IP` and `Port` Robot
4. `yarn build`
5. `yarn start`
6. You are perfect! 💞

### Run test ☃️

1. `yarn build`
2. `yarn test`
3. You are wonderful! ✨



### Informations 🕸

#### Ports:
1. 30002 - Every 300 ms comes information about the robot, its state, information about the controller
2. 30001 - Modbus port
3. 29999 - Polyscope dashboard port, command port

#### 29999 Port, commands

Send via socket ASCII text command.

1. `load <program.urp>` - Load the specified program. Returns when loading has completed.
2. `play` - Starts program, if any program is loaded and robot is ready. Returns when the program execution has been started.
3. `stop` - Stops running program and returns immediately.
4. `pause` - Pauses the running program and returns immediately.
5. `quit` - Closes connection
6. `shutdown` - Shuts down and turns off robot and controller
7. `running` - Execution state enquiry
8. `robotmode` - Robot mode enquiry (see Robot mode)
9. `get loaded program` - Which program is loaded
10. `popup <popup-text>` -  The popup-text will be translated to the selected language, if the text exists in the language file
11. `close popup` - Closes the popup
12. `addToLog <log-message>` - Adds log-message to the Log history
13. `isProgramSaved` - Returns the save state of the active program and path to loaded program file.
14. `programState` - Returns the state of the active program and path to loaded program file, or STOPPED if no program is loaded
15. `PolyscopeVersion` - Returns the version of the Polyscope software
16. `setUserRole <role>` - Control of user privileges: controls the available options on the Welcome screen. (see user roles)
17. `power on` - Powers on the robot arm
18. `power off` - Powers off the robot arm
19. `brake release` - Releases the brakes
20. `safetymode` - Safety mode enquiry (see safety modes)
21. `unlock protective stop` - Closes the current popup and unlocks protective stop
22. `close safety popup` - Closes a safety popup
23. `load installation` - Loads the specified installation file.


#### Robot modes
```CSharp
NO_CONTROLLER_MODE = -1
ROBOT_RUNNING_MODE = 0 (This is "normal" mode)
ROBOT_FREEDRIVE_MODE = 1
ROBOT_READY_MODE = 2
ROBOT_INITIALIZING_MODE = 3
ROBOT_SECURITY_STOPPED_MODE = 4
ROBOT_EMERGENCY_STOPPED_MODE = 5
ROBOT_FAULT_MODE = 6
ROBOT_NO_POWER_MODE = 7
ROBOT_NOT_CONNECTED_MODE = 8
ROBOT_SHUTDOWN_MODE = 9
```

#### Safety Modes
```
NORMAL
REDUCED
PROTECTIVE_STOP
RECOVERY
SAFEGUARD_STOP
SYSTEM_EMERGENCY_STOP
ROBOT_EMERGENCY_STOP
VIOLATION
FAULT
```

#### User roles
```CSharp
programmer = In Setup Robot, buttons "Update", "Set Password", "Network", "Time" and "URCaps" are disabled, "Expert Mode" is available (if correct password is supplied)
operator = Only "RUN Program" and "SHUTDOWN Robot" buttons are enabled, "Expert Mode" cannot be activated
none ( or send setUserRole) = All buttons enabled, "Expert Mode" is available (if correct password is supplied)
locked = All buttons disabled and "Expert Mode" cannot be activated

```
