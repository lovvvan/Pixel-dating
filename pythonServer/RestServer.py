from flask import Flask
from flask import request
from flask_cors import CORS
from flask_pymongo import PyMongo
import datetime
from PIL import Image
from Matcher import Matcher
from ImageHandler import pixelize
import json
from PIL import Image
import gridfs
import os
import base64
from bson import ObjectId
from io import BytesIO
# In terminal window start server by running these commands :
# export FLASK_APP=RestServer.py
# flask run

depixilizationRate = 5

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/*": {"origins": "*"}})
# TODO: Currently allows all origins, not safe, limit this
matcher = Matcher()

# Validate that keys exist in data
def validateData(keys: [str], data):
    for key in keys:
        if (key not in data):
            return False
    return True

# EXAMPLE
# GET request to yourIP:5000
# You should retrieve Hello, World!
@app.route('/')
def hello_world():
    return 'Hello, World!'


app.config["MONGO_URI"] = "mongodb://localhost:27017/pixeliceDB"
mongo = PyMongo(app)



def insertDummyToDB(collection, fileName):
    data = []
    with open(f'dummyData/{fileName}.json', 'r') as input_f:
        data = json.load(input_f)

    if isinstance(data, list):
        collection.insert_many(data)
    else:
        collection.insert_one(data)

def insertDummyChatroomsToDB(chatrooms_collection, users_collection):
    data = []
    with open(f'dummyData/dummyDataChatrooms.json', 'r') as input_f:
        data = json.load(input_f)

    for chatroom in data:
        userIDs = []
        usernames = chatroom["userIDs"]
        for username in usernames:
            myquery = { "username": username}
            user = users_collection.find(myquery)
            user = user[0].get('_id')
            userIDs.append(user)
        chatroom["userIDs"] = userIDs
        chatrooms_collection.insert_one(chatroom)


def insertDummyMessagesToDB(chatrooms_collection, messages_collection):
    data = []
    with open(f'dummyData/dummyDataMessages.json', 'r') as input_f:
        data = json.load(input_f)

    for message in data:
        chatroomIDs = chatrooms_collection.find()
        senderID = chatroomIDs[0].get('userIDs')
        message["senderID"] = senderID[0]

        messageID = messages_collection.insert_one(message)
        myquery = { "_id": chatroomIDs[0].get('_id') }
        newvalues = {'$push': {'messages': messageID.inserted_id}}
        chatrooms_collection.update_one(myquery, newvalues)


# curl http://127.0.0.1:5000/populateDB
@app.route('/populateDB')
def populateDB():
    users_collection = mongo.db.users
    admins_collection = mongo.db.admins
    chatrooms_collection = mongo.db.chatrooms
    messages_collection = mongo.db.messages
    icebreakers_collection = mongo.db.icebreakers

    insertDummyToDB(users_collection, "dummyDataUsers")
    insertDummyToDB(admins_collection, "dummyDataAdmins")
    insertDummyChatroomsToDB(chatrooms_collection, users_collection)
    insertDummyMessagesToDB(chatrooms_collection, messages_collection)
    insertDummyToDB(icebreakers_collection, "dummyDataIcebreakers")

    return '<h1>Added three Users!</h1>'



# curl http://127.0.0.1:5000/dropDB
# curl http://yourIP:5000/dropDB
@app.route('/dropDB')
def dropDB():
    users_collection = mongo.db.users
    admins_collection = mongo.db.admins
    chatrooms_collection = mongo.db.chatrooms
    messages_collection = mongo.db.messages
    icebreakers_collection = mongo.db.icebreakers
    users_collection.drop()
    admins_collection.drop()
    chatrooms_collection.drop()
    messages_collection.drop()
    icebreakers_collection.drop()
    return '<h1>The database has been dropped!</h1>'

# curl http://127.0.0.1:5000/storeImgDB
@app.route('/storeImgDB', methods=['POST'])
def storeImgDB():
    fs = gridfs.GridFS(mongo.db)
    requiredData = [
        'name',
        'userID',
        'file_attachment'
    ]
    data = json.loads(request.data)
    if (validateData(requiredData, data)):
        photo_base64 = data['file_attachment']['photo_base64']
        userID = data['userID']
        print(userID)
        photo_bytecode = base64.b64decode(photo_base64)

        imgID = fs.put(photo_bytecode)

        myquery = {'_id' : ObjectId(userID)}
        user_collection = mongo.db.users
        user = user_collection.find_one(myquery)

        newValue = {'$set': {'imageID':imgID}}
        res = user_collection.update_one(myquery, newValue)

        # Uncomment for video :)
        # user = user_collection.find_one(myquery)
        # fromUserImgID = user['imageID']
        # out = fs.get(fromUserImgID)
        # picture = Image.open(out)
        # picture.show()

        return json.dumps({
                "success" : True,
                "statusMessage" : "image uploaded",
                })
    return json.dumps({
                "success" : False,
                "statusMessage" : "data validation failed",
                })




@app.route('/getImage', methods=['POST'])
def getImage():
    fs = gridfs.GridFS(mongo.db)
    requiredData = [
        'userID',
    ]
    data = json.loads(request.data)
    if (validateData(requiredData, data)):
        userID = data['userID']

        myquery = {'_id' : ObjectId(userID)}
        user_collection = mongo.db.users
        user = user_collection.find_one(myquery)


        user = user_collection.find_one(myquery)
        print(user.keys())
        if 'imageID' in user.keys():
            fromUserImgID = user['imageID']
            if (fs.exists(fromUserImgID)):
                imageData = fs.get(fromUserImgID)

                photo_base64_bytes = base64.b64encode(imageData.read())
                photo_base64 = photo_base64_bytes.decode() #  default? Think its Ascii but idk.

                return json.dumps({
                        "success" : True,
                        "imageData" : photo_base64,
                        "statusMessage" : "image uploaded",
                        })
        return json.dumps({
                    "success" : False,
                    "imageData" : "",
                    "statusMessage" : "no image for user found",
                    })
    return json.dumps({
                "success" : False,
                "statusMessage" : "data validation failed",
                })


@app.route('/getImagePixTest', methods=['POST'])
def getImagePixTest():
    fs = gridfs.GridFS(mongo.db)
    requiredData = [
        'userID',
        'pixLevel',
    ]
    data = json.loads(request.data)
    if (validateData(requiredData, data)):
        userID = data['userID']
        pixelizationLevel = data['pixLevel']

        myquery = {'_id' : ObjectId(userID)}
        user_collection = mongo.db.users
        user = user_collection.find_one(myquery)

        print(user.keys())
        if 'imageID' in user.keys():
            fromUserImgID = user['imageID']
            if (fs.exists(fromUserImgID)):
                imageData = fs.get(fromUserImgID)

                image = Image.open(imageData) #Pixelizing certain images will tilt them 90*
                pixelized_image = pixelize(pixelizationLevel, image) #Pixelizing certain images will tilt them 90*
                #pixelized_image.show()

                buffer = BytesIO()
                pixelized_image.save(buffer, format="JPEG")
                photo_base64_bytes = base64.b64encode(buffer.getvalue())
                photo_base64 = photo_base64_bytes.decode()

                return json.dumps({
                        "success" : True,
                        "imageData" : photo_base64,
                        "statusMessage" : "image uploaded",
                        })
        return json.dumps({
                    "success" : False,
                    "imageData" : "",
                    "statusMessage" : "no image for user found",
                    })
    return json.dumps({
                "success" : False,
                "statusMessage" : "data validation failed",
                })


@app.route('/getImagePixelized', methods=['POST'])
def getImagePixelized():
    fs = gridfs.GridFS(mongo.db)
    requiredData = [
        'userID',
        'chatroomID'
    ]
    data = json.loads(request.data)
    if (validateData(requiredData, data)):
        userID = data['userID']
        chatroomID = data['chatroomID']

        myquery = {'_id' : ObjectId(userID)}
        user_collection = mongo.db.users
        user = user_collection.find_one(myquery)


        user = user_collection.find_one(myquery)
        if 'imageID' in user.keys():
            fromUserImgID = user['imageID']
            if (fs.exists(fromUserImgID)):
                imageData = fs.get(fromUserImgID)

                chatrooms_collection = mongo.db.chatrooms
                chatroomIDObject = chatrooms_collection.find_one({'_id':ObjectId(chatroomID)})


                pixelizationLevel = int(chatroomIDObject.get('pixilisationLevel'))
                print(pixelizationLevel)


                image = Image.open(imageData) #Pixelizing certain images will tilt them 90*
                pixelized_image = pixelize(pixelizationLevel, image) #Pixelizing certain images will tilt them 90*
                #pixelized_image.show()

                buffer = BytesIO()
                pixelized_image.save(buffer, format="JPEG")
                photo_base64_bytes = base64.b64encode(buffer.getvalue())
                photo_base64 = photo_base64_bytes.decode() #  default? Think its Ascii but idk.

                return json.dumps({
                        "success" : True,
                        "imageData" : photo_base64,
                        "statusMessage" : "image uploaded",
                        })
        return json.dumps({
                    "success" : False,
                    "imageData" : "",
                    "statusMessage" : "no image for user found",
                    })
    return json.dumps({
                "success" : False,
                "statusMessage" : "data validation failed",
                })



# Create account
# EXAMPLE
# Template request for future reference:
# curl -X POST -H "Content-Type: application/json" -d '{"username": "Pelle", "password": "kjelle", "email": "pelle@kjelle.com"}' -v -i 'yourIP:5000/createAccount'
@app.route('/createAccount', methods=['POST'])
def createAccount():
    # Data required to be sent
    requiredData = [
        'username',
        'email',
        'password'
    ]

    data = json.loads(request.data)
    if (validateData(requiredData, data)):

        user_collection = mongo.db.users
        images_collection = mongo.db.images

        user_count = user_collection.count_documents({"username" : data['username']})
        email_count = user_collection.count_documents({"email" : data['email']})

        if (user_count == 0 and email_count == 0) :
            username = data['username']

            with open(r'defaultProfilePicture.jpg', 'rb') as f:
                imgStr = f.read()
                
            fs = gridfs.GridFS(mongo.db)
            imgID = fs.put( imgStr )

            data['imageID'] = imgID

            userID = str(user_collection.insert_one(data).inserted_id)
            return json.dumps({
                    "success" : True,
                    "statusMessage" : "account created",
                    "username" : username,
                    "userID" : userID
                    })
        else :
            if (user_count != 0) :
                return json.dumps({
                    "success" : False,
                    "statusMessage" : "username already in use",
                    "username" : "",
                    "userID" : ""
                    })
            else :
                return json.dumps({
                    "success" : False,
                    "statusMessage" : "email already in use",
                    "username" : "",
                    "userID" : ""
                    })
    else:
        return json.dumps({
                    "success" : False,
                    "statusMessage" : "Missing data",
                    "username" : "",
                    "userID" : ""
                    })


def updatePixLevel(chatroomID):
    chatrooms_collection = mongo.db.chatrooms

    chatroomIDObject = chatrooms_collection.find_one({'_id':ObjectId(chatroomID)})
    messageCount = int(chatroomIDObject.get('messageCount'))
    pixLevel = int(chatroomIDObject.get('pixilisationLevel'))

    correctPixLevel = 5 - messageCount // depixilizationRate



    if (correctPixLevel < 0):
        correctPixLevel = 0

    print(f"Message count: {messageCount}, rate: {depixilizationRate}, correctPixLevel: {correctPixLevel}, pixLevel: {pixLevel}")

    if (correctPixLevel != pixLevel):
        myquery = { "_id": chatroomIDObject.get('_id') }
        newvalues = {'$set': {'pixilisationLevel': correctPixLevel}}
        updateRes = chatrooms_collection.update_one(myquery, newvalues)
        return True

    else:
        return False

@app.route('/sendMessageREST', methods=['POST'])
def sendMessageREST():
    requiredData = [
        'userID',
        'message',
        'chatroomID'
    ]
    data = json.loads(request.data)
    if (validateData(requiredData, data)):
        messages_collection = mongo.db.messages
        chatrooms_collection = mongo.db.chatrooms

        userID = data['userID']
        message = data['message']
        chatroomID = data['chatroomID']

        db_message = {
            "message" : message,
            "senderID" : userID,
            "dateTime" : datetime.datetime.now()
        }

        messageID = messages_collection.insert_one(db_message)

        chatroomIDObject=chatrooms_collection.find_one({'_id':ObjectId(chatroomID)})
        if chatroomIDObject:
            myquery = { "_id": chatroomIDObject.get('_id') }
            newvalues = {'$push': {'messages': messageID.inserted_id}}
            updateRes = chatrooms_collection.update_one(myquery, newvalues)
            print("Update result acknowledged: ", updateRes.acknowledged)

            newvalues = {'$inc': {'messageCount': 1}}
            updateRes = chatrooms_collection.update_one(myquery, newvalues)

            updatedRes = updatePixLevel(chatroomIDObject.get('_id'))

            return json.dumps({
                    "success" : True,
                    "messageID" : str(messageID.inserted_id),
                    "statusMessage" : "message is stored",
                    "pixelLevelUpdated" : updatedRes
                    })
        return json.dumps({
                "success" : False,
                "messageID" : "",
                "statusMessage" : "chat does not exist",
                "pixelLevelUpdated" : False
                })
    else:
        return json.dumps({
                "success" : False,
                "messageID" : "",
                "statusMessage" : "message could not be stored",
                "pixelLevelUpdated" : False
                })


@app.route('/Login', methods=['POST'])
def Login():
    # Data required to be sent
    requiredData = [
        'username',
        'password'
    ]
    data = json.loads(request.data)
    if (validateData(requiredData, data)):
        user_collection = mongo.db.users
        user = user_collection.find({"username" : data['username']})
        user_count = user_collection.count_documents({"username" : data['username']})
        if (user_count == 0) :
            return json.dumps({
                    "success" : False,
                    "statusMessage" : "username does not exist",
                    "username" : "",
                    "userID" : ""
                    })
        elif (user_count > 1) :
            return json.dumps({
                    "success" : False,
                    "statusMessage" : "Something went horribly wrong ( more than one user with this username, please contact support. )",
                    "username" : "",
                    "userID" : ""
                    })
        else :
            password = str(user[0].get("password"))
            if (password == data['password']) :
                return json.dumps({
                    "success" : True,
                    "statusMessage" : "Welcome " + data['username'] + " !",
                    "username" : data['username'],
                    "userID" : str(user[0].get("_id"))
                    })
            else :
                return json.dumps({
                    "success" : False,
                    "statusMessage" : "incorrect password...",
                    "username" : "username",
                    "userID" : ""
                    })
    return json.dumps({
                "success" : False,
                "statusMessage" : "Missing data",
                "username" : "",
                "userID" : ""
                })

# curl -X POST -H "Content-Type: application/json" -d '{"userID": "60360fd6a2a1c350771d5b80"}' -v -i 'yourIP:5000/createNewChat'
@app.route('/newMatch', methods=['POST'])
def createNewChat():
    data = json.loads(request.data)
    # Data required to be sent
    requiredData = [
        'userID'
    ]
    if (validateData(requiredData, data)):
        userID = data['userID']
        matchedUserID = matcher.findMatch(userID)

        if matchedUserID:
            print(userID + ' was matched with ' + matchedUserID)

            chatroomID = None
            chatrooms_collection = mongo.db.chatrooms
            users_collection = mongo.db.users
            if (userID < matchedUserID):
                chatroomIDObject=chatrooms_collection.find_one({'userIDs':[userID, matchedUserID]})
                if (not chatroomIDObject):
                    currentDate = datetime.datetime.now()
                    newChatroom = {}
                    newChatroom['dateOfCreation'] = currentDate
                    newChatroom['pixilisationLevel'] = '5'
                    newChatroom['messages'] = []
                    newChatroom['userIDs'] = [userID, matchedUserID]
                    newChatroom['messageCount'] = 0
                    chatroomID = chatrooms_collection.insert(newChatroom)
                else:
                    chatroomID = chatroomIDObject.get('_id')
            else:
                wait = True
                while(wait):
                    chatroomIDObject=chatrooms_collection.find_one({'userIDs':[matchedUserID, userID]})
                    if (chatroomIDObject):
                        chatroomID = chatroomIDObject.get('_id')
                        wait = False

            matchIDObject = users_collection.find_one({'_id':ObjectId(matchedUserID)})
            matchUsername = matchIDObject.get('username')

            return json.dumps({
                'success' : 'true',
                'statusMessage' : 'match created',
                'value' : matchedUserID,
                'matchUsername' : matchUsername,
                'chatroomID' : str(chatroomID)
            })
        else:
            print("no match")
            return json.dumps({
                'success' : 'false',
                'statusMessage' : 'failure, probably duplicate requests',
                'value' : ''
            })
    else:
        return '{"success" : false, "statusMessage" : "missing data"}'

@app.route('/endMatch', methods=['POST'])
def removeChat():
    data = json.loads(request.data)
    # Data required to be sent
    requiredData = [
        'chatroomID'
    ]
    if (validateData(requiredData, data)):
        chatroomID = data['chatroomID']
        # remove all messages and the chat itself.
        chatrooms_collection = mongo.db.chatrooms
        messages_collection = mongo.db.messages
        chatroomObject=chatrooms_collection.find_one({'_id':ObjectId(chatroomID)})
        if chatroomObject:
            for messageID in chatroomObject['messages']:
                messages_collection.delete_one({'_id':ObjectId(messageID)})

            chatrooms_collection.delete_one({'_id':ObjectId(chatroomID)})
            return json.dumps({
            'success' : True,
            'statusMessage' : 'Chat removed successfully.',
            'value' : ''
            })    
        return json.dumps({
        'success' : False,
        'statusMessage' : 'Failure, chatroom does not exist',
        'value' : ''
        })
    return json.dumps({
        'success' : False,
        'statusMessage' : 'Failure, data validation',
        'value' : ''
    })


@app.route('/testPixelization', methods=['GET'])
def testPixelization():
    image_url = 'cat.png'

    image = Image.open(image_url)
    # Show unpixelized image
    image.show()

    # Show all levels of pixelized image
    for i in range(1,6):
        image = Image.open(image_url)
        pixelized_image = pixelize(i, image)
        pixelized_image.show()

    #pixelized_image = pixelize(5, image)


    return '<p>Pixelized cats</p>'




app.run(debug=True, host='0.0.0.0', port=5000)
