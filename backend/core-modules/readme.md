# Directory: core-modules

This directory is for core modules from outside of the base core framework to delivery the functionality and features
required. These are not to be changed directly, just like core, and should instead be extended in higher levels of directories
(ie core-staging, global app, app specifc directory).

This allows for a safe and easy "drag and drop" of newer core versions into the project, not having to worry about the building blocks
that give the unique flavor to the application.