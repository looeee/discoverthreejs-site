Hugo ReadFile cannot access files outside the Hugo folder, so Symlinks are required.
In case these get broken, store all powershell mklink commands here

For directory:
& cmd /c "mklink /J dst src"

For files
& cmd /c "mklink dst src"

