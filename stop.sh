#!/bin/bash

pid=`ps -ef | fgrep "lottery.py" |fgrep -v "fgrep" | awk '{print $2}'`
echo $pid

if [ $pid ]
then
	kill -9 $pid 
fi
