#!/bin/bash

while true;
do amixer -c 0 set 'Mic Boost' 0db > /dev/null;
  amixer -c 0 set 'Capture' 35db > /dev/null;
  sleep 1;
done;

