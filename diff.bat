
echo off

rmdir /s /q tmp
mkdir tmp
mkdir tmp\new
mkdir tmp\old

copy lecture%1.html tmp\old\lecture.html
copy lecture%2.html tmp\new\lecture.html

if not exist lecture%1 goto noolddir
copy lecture%1\*.* tmp\old

:noolddir
if not exist lecture%2 goto nonewdir
copy lecture%2\*.* tmp\new

:nonewdir
windiff tmp\old tmp\new