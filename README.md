## Stack Exchange Post Editor

A UserScript for cleaning up Stack Exchange posts according to some simple automatic algorithms.

### Why do we need this UserScript?

Although a [similar script](http://stackapps.com/questions/2209/se-editor-toolkit) already exists, the native version only runs on Safari. There was an attempt to port the script to other browsers, but it failed miserably and broke far too often. Therefore, this project is an attempt to create a native UserScript version from the ground up that provides somewhat similar functionality but remains unique.

### Okay, what features will this script have?

We're looking at a number of different features, but primarily we want to include:

- Automatic removal of signature lines ("thanks", etc.)
- Correction of capitalization (standalone 'i' should be capitalized, etc.)

### How do I build this thing?

You will need [Juice Builder](https://github.com/nathan-osman/Juice-Builder) in order to build the UserScript. Basically this involves running the following command:

    python juice.py

You will then have a file named `sepostedit.user.js` in the current directory.

### Can I help?

Certainly! Just fork this project and start adding awesome features.

