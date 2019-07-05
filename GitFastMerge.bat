:: turn of echo for formatting reasons
@ECHO off

TITLE Git Fast Merge

echo This script will check for updates from a branch and merge the branch you are working on to it 
echo If there are merge conflicts you will need to fix them before the script is able to merge with the other branch
echo If the branch you want to commit does not exist this script will create the branch for you
echo.

set /p check="Does the branch you are working on exist in the remote repo? (yes / no) : "
set /p masterbranch="What branch would you like to commit to (probably master)? : "
set /p inputbranch="What branch would you like to commit (your branch you are working on)? : "
set /p message="What would you like your commit message to say? : "

:: merge process
git reset HEAD -- .
git checkout %masterbranch%
git pull origin %masterbranch%
IF /I "%check%"=="no" (
    echo creating branch
    git checkout -b %inputbranch%
) ELSE (
    echo branch exists
    git checkout %inputbranch%
    git pull origin %inputbranch%
)
git add .
git commit -m "%message%"
git push -u origin HEAD
IF /I "%masterbranch%"=="" (
    git checkout master
    git pull origin master
    git checkout %inputbranch%
    git merge master

) ELSE (
    git checkout %masterbranch%
    git pull origin %masterbranch%  
    git checkout %inputbranch%
    git merge %masterbranch%

)


:: tfs pull requests instructions
echo.
echo Done! Now you can if you choose to, continue to make your pull request on tfs/github
echo.
echo Here are the steps to do so:
echo 1: Go to TFS and go to your repo
echo 2: Go to the code tab and then below select the Pull requests tabe
echo 3: Click the blue New pull request tab
echo 4: Select the branch you just commited to under the review changes in pulldown
echo 5: Select relative to the branch you commited to (probably master)
echo 6: Fill out any other details you may need

:: wait for the user to exit window
:: TODO figure out what paths are needed
PAUSE