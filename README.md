# JSCII

JSCII is a portmanteau of Javascript (JS) and the American Standard Code for Information Interchange (ASCII). I guess we could call it JavaScript Code for Information Interchange or JavaScript Code for Interesting Images, since this is a drawing program.

## Description

This project is about making it easier to draw ASCII art, using shortcuts for making lines and boxes. I was inspired by [asciiflow.com], but thought of a few ways I might have handled the problem better. This is also a coding exercise, so I'll be doing a lot of work refactoring the code, even when it is already working.

## Progress

At the moment, you can add text and select boxes, but there is no way to save anything or draw anything. The minimum planned drawing features are boxes, lines, and freehand. Circles would be a fun challenge.

## Current Goal

Once again, I am in the process of reworking the code. This time, I want to isolate all the global variables into one object and change the syntax of the functions. Functions that return a property or value will be attached to objects. Functions that transform objects will be passed that object as the first parameter. For example, to push to an array, I would use `newArray = pushToArray(oldArray, newValue)`, but to find the last element of the array, I would use `array.lastElement()`. I will continue to avoid having side effects, but if necessary, a function with side effects should be run on its own, with no return value, and only in the `main.js` file.
