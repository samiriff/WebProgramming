#!/bin/bash

cd ./../apache-tomcat-6.0.36/bin
./shutdown.bat
sleep 3
cp -r /cygdrive/c/Users/pkumar/Downloads/rest-demo/build/sample/exercise /cygdrive/c/Users/pkumar/Downloads/apache-tomcat-6.0.36/webapps/restdemo/WEB-INF/classes/sample

./startup.bat