# JSCII

JSCII is a portmanteau of Javascript (JS) and the American Standard Code for Information Interchange (ASCII). I guess we could call it JavaScript Code for Information Interchange or JavaScript Code for Interesting Images, since this is a drawing program.

## Description

This project is about making it easier to draw ASCII art, using shortcuts for making lines and boxes. I was inspired by [asciiflow.com], but thought of a few ways I might have handled the problem better. This is also a coding exercise, so I'll be doing a lot of work refactoring the code, even when it is already working.

## Progress

At the moment, you can add text and select boxes, but there is no way to save anything or draw anything. The minimum planned drawing features are boxes, lines, and freehand. Circles would be a fun challenge.

## Current Goal

I don't like the organization of the code. Even breaking it into separate files was difficult. I think I will try to take a more functional approach with redraw() and reslect() being the only methods that actually change what is seen on the screen. I will call these directly from main.js, so it is clear what is happening. I will also pass the drawing array to functions, rather than using it as a global variable.
