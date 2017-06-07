# JSCII

JSCII is a portmanteau of Javascript (JS) and the American Standard Code for Information Interchange (ASCII). I guess we could call it JavaScript Code for Information Interchange or JavaScript Code for Interesting Images, since this is a drawing program.

## Description

This project is about making it easier to draw ASCII art, using shortcuts for making lines and boxes. I was inspired by [asciiflow.com], but thought of a few ways I might have handled the problem better. This is also a coding exercise, so I'll be doing a lot of work refactoring the code, even when it is already working.

## Progress

At the moment, you can add text and select boxes, but there is no way to save anything or draw anything. The minimum planned drawing features are boxes, lines, and freehand. Circles would be a fun challenge.

## Current Goal

Having learned a bit more about JavaScript, it is clear that more refactoring will be required. I think I will abandon the goal of a functional approach for this app and just focus on getting it working. There are still some methods that do not properly copy objects, however. Since Javascript passes references instead of copies of objects to functions, I will probably have to modify objects in place.


