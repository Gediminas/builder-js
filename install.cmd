@echo off
pushd _scripts\bin || exit /b 1
assoc .=shebangfile
ftype shebangfile=%cd%\shebang.cmd "%%1" %%*
setx /m PATHEXT %PATHEXT%;.
setx PATHEXT %PATHEXT%;.
set PATHEXT=%PATHEXT%;.
echo PATHEXT: %PATHEXT%
popd
echo on
