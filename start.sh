#!/bin/bash

# Set up exit handler to kill all child processes
cleanup() {
    # Kill all processes in the current process group
    kill 0
}

# Register the cleanup function to run on script exit
trap cleanup EXIT

bash ./api/start.sh $1 &
cd client && bun dev
