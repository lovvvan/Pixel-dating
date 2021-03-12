from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, leave_room, send, emit
import json
from flask_cors import CORS
from flask_pymongo import PyMongo
import datetime
#from RestServer import send_messageREST

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/*": {"origins": "*"}})
# TODO: Currently allows all origins, not safe, limit this
socketio = SocketIO(app, cors_allowed_origins="*", engineio_logger=True, logger=True)

app.config["MONGO_URI"] = "mongodb://localhost:27017/pixeliceDBB"
mongo = PyMongo(app)

# On connection error
@socketio.on('connection_error')
def on_connect_error(err):
    print(err)


# Join chat room
@socketio.on('join')
def on_join(data):
    username = data['username'] # change name
    userID = data['userID'] # change name
    chatroomID = data['chatroomID']

    join_room(chatroomID)

    # TODO Go to database and get all previous messages
    '''
    reply = {
        "from" : username,
        "message" : username + " has entered the chat."
    }
    send(json.dumps(reply), room=chatroomID)
    '''


# TODO ONLY TEMPLATE
@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['chatroomID']
    leave_room(room)
    # TODO Database set user as inactive from connect
    reply = {
        "from" : username,
        "message" : username + " has left the chat",
        "messageID" : "leaveMessage"
    }
    send(json.dumps(reply), room=room)
    emit('matchEnded', {'hello': 'world'}, room=room)


# Send chat message
@socketio.on('message')
def send_message(data):
    userID = data['userID']
    message = data['message']
    messageID = data['messageID']
    chatroomID = data['chatroomID']
    username = data['username']
    pixelLevelUpdated = data['pixelLevelUpdated']

    # TODO store in DB message in db from here instead of RestServer
    reply = {
        "from" : username,
        "message" : message,
        "messageID" : messageID,
        "pixelLevelUpdated" : pixelLevelUpdated
    }
    send(json.dumps(reply), room=chatroomID)



if __name__ == '__main__':
    socketio.run(app, debug=True, port=5005, host='0.0.0.0')
