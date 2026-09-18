#!/bin/bash
cd "$(dirname "$0")/backend"

if [ ! -d "venv" ]; then
    python -m venv venv
fi

source venv/Scripts/activate
exec bash   