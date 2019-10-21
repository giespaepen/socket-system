#!/bin/sh

set -e

if [[ -z "${TYPE}" ]]; then
    echo "TYPE env variable not set"
    exit 1
else
    case $TYPE in
        "server")
            echo "Starting socket-server"
            node ./socket-server/dist/index.js
            ;;
        "sink")
            echo "Starting socket-sink"
            node ./socket-sink/dist/index.js
            ;;
    esac
    echo "The TYPE ${TYPE} is not known. It must be server or sink."
fi
