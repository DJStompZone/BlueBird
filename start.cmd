@echo off

if not exist node_modules (
    bin\npm.cmd i
    if exist bin\node.exe (
        bin\node.exe start.js
    ) else (
        echo Cannot find node.exe file please reinstall BlueBird
    )
) else (
    if exist bin\node.exe (
        bin\node.exe start.js
    ) else (
        echo Cannot find node.exe file please reinstall BlueBird
    )
)