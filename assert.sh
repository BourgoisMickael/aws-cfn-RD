#!/usr/bin/env bash

# Don't use /bin/bash on mac it's stuck on old v3 and doesn't support colors
# Install latest bash version


# @see https://ouep.eu/shell/fonction-assert/
function assert {
  # First parameter is the message in case the assertion is not verified
  message="$1"

  # The remaining arguments make the command to execute
  shift

  # Run the command, $@ ensures arguments will remain in the same position.
  # "$@" is equivalent to "$1" "$2" "$3" etc.
  printf "\e[33mRunning: (%s \"\e[36m%s\e[33m\" %s \"\e[36m%s\e[33m\"): \e[0m" "$@"
  "$@"

  # Get the return code
  rc=$?

  # If everything is okay, there's nothing left to do
  [ $rc -eq 0 ] && echo -e "\e[32mSUCCESS\e[0m" && return 0

  echo -e "\e[31mFAILURE\e[0m"
  # An error occured, retrieved the line and the name of the script where
  # it happend
  set $(caller)

  # Get the date and time at which the assertion occured
  date=$(date "+%T")

  # Output an error message on the standard error
  # Format: date script [pid]: message (linenumber, return code)
  echo -e "\e[91m$date $2 [$$]: \e[31m$message\e[91m (line=$1, rc=$rc)\e[0m" >&2

  # Exit with the return code of the assertion test
  exit $rc
}

assert "$@"
