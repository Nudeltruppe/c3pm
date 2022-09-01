# Config

- use a custom config file format
  - each stanza is separated by a new-line
  - requires a entrypoint stanza
  - you can add stuff to the config file via commands in the command line
  - you can have library's
  - all libs will be compiled and are tried to link. This is also done for all files specified in the source dir stanza

# List of all valid stanzas

    entryPoint: <path_to_file>
    srcDir: <directory with all main files>
    name: <name of the output binary>
    depends: <github url to library>

# Functionality (build)

compile every library in the libs folder to object files

compile every file that can be compiled to an object file in the source directory to an object file (except the entry point)

link and compile the main file (end of build stage)

# Functionality (package manager)

install specified github repos as libs. Make some sort of file that has all the librarys with names and so on
