# module-md Design

## Internal Workflow

 1. collect & read source files
 1. parse each file into an AST
 1. walk the AST with ast-walker & extract intel
 1. TODO: create a context between exports, classes & functions across a module
 1. TODO: create a context between modules
 1. TODO: markdown: render _class_ docs
