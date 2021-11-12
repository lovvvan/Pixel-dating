# Pixelice
Pixelice is a dating app where the users profile pictures are pixelated so that they cannot see each other at first. As they talk, the images get less pixelated and after chatting even more the users can eventually see each others images. 

The purpose of this app was to create a dating app that focuses a little more on personalities than looks. 

It is coded in React Native to work on both android and iOS. 

## DEMO

Here is a link to a short video demo of the app: https://www.youtube.com/watch?v=dZmlXWAWUmA 

## System Architecture



## Run RestServer
Make sure you have flask,flask_cors and flask-pymongo installed (pip install)
Start server with the command :
`python RestServer.py`

## Run ChatServer
Make sure you have flask, flask_socketio, flask_cors and flask-pymongo, gevent-websocket, Pillow installed (pip install)
Start server with the command :
`python ChatServer.py`

## Install mongoDB
Follow the instruction in this link:https://docs.mongodb.com/manual/administration/install-community/
Then install flask-pymongo using `pip install flask-pymongo`

## Test cases with instruction
Always start by setting up the database and server and then continue on one of the instructions below.
Terminal window 1:
`make startMacDB` (for Mac OS)
`cd pythonServer`
`python RestServer.py`

### Test add user
Terminal window 2:
`curl -X POST -H "Content-Type: application/json" -d '{"username": "Pelle", "password": "kjelle", "email": "pelle@kjelle.com"}' -v -i '127.0.0.1:5000/createAccount'`

Terminal window 3:
`mongo` (to open the database shell)
`show dbs` (to show all databases, pixeliceDB should be listed)
`use pixeliceDB`
`db.users.find()` (to show users)

### Test that the database is connected
Terminal window 2:
`curl http://127.0.0.1:5000/addUserToDB`

Terminal window 3:
`mongo` (to open the database shell)
`show dbs` (to show all databases, pixeliceDB should be listed)
`use pixeliceDB`
`db.users.find()` (to show users)

### Drop database
Terminal window 2:
`curl http://127.0.0.1:5000/dropDB`

Terminal window 3:
`show dbs` (only admin, config and local should be listed now and NOT pixelice)

###Stop database
Terminal window 1:
`make stopMacDB` (for Mac OS)

### Test frontend
PC:

Terminal window 1:
You have to navigate to the mobileapp folder to instal npm modules by utilizing the command `npm install`
In order to install expo and utilize it you have to use the command `npm install --global expo-cli` to install expo package to be able to start the project.
After installing expo you navigate to the mobileapp folder and use the command `npm install`  alternatively `expo install`. After the installation is finished run
`expo start` (this will start a connection to expo server and open up the connect in browser)
To install image-picket, run: expo install expo-image-picker

Phone:
You have to download expo app from your mobile/app store called "Expo go"
You'll have to scan the QR code with your phone. if you're using android this can be done from the expo go app and if you have iphone it can be done by opening the camera app and scanning with that.
After you scand the code you'll have the app open on your phone and linked with the server opened in browser.
