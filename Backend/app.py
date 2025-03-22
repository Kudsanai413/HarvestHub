import eventlet
eventlet.monkey_patch()
from flask import Flask, jsonify, request, redirect, url_for as URL, render_template as render, send_file as image, session, Response
from flask_cors import CORS
from flask_mail import Mail, Message
from connect import Database
from constants import createID as creation, default_error_response as error, column, StartBackgroundThread, StopBackgroundThread
import requests
from werkzeug.utils import secure_filename
import os as OS
import re as regex
from second import web_app
from flask_socketio import SocketIO, join_room, send
from socket_functions import SocketLogin
import time
import threading


stop_event = threading.Event()
update_thread = None

UPLOAD = OS.path.join(OS.getcwd(), "static/images") if OS.path.exists("./static/images") else OS.path.curdir
boundary : str = "boundary"
app : Flask = Flask(__name__)
app.register_blueprint(web_app, url_prefix="/admin")
app.debug = True
CORS(app, resources={r"/*": {"origins": "*"}})
socket = SocketIO(app, cors_allowed_origins="*")
# Configuration For Handling Email Transfer
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'kudsiemtusva@gmail.com'
app.config['MAIL_PASSWORD'] = '1234567'
app.config['MAIL_DEFAULT_SENDER'] = ('HarvestHub', 'kudsiemtusva@gmail.com')
app.config['MAIL_MAX_EMAILS'] = None
app.config['MAIL_ASCII_ATTACHMENTS'] = False
# app.config["DOWNLOAD_FOLDER"] http://127.0.0.1:5000/image
mail = Mail(app)

old_version = 0
curr_version = 0


@app.route("/")
def Index():
    try:
        database = Database()
        sql_statement : str = """
            Select * From Farmers
            Union
            Select * From Buyers
        """
        records = database.execute(sql_statement)
        return jsonify({ "All Users" : [row for row in records]})

    except Exception as e:
        return f"Error:\n { e.args }"


# Login Authentication
# @app.route("/login", methods=["POST"])
@app.route("/login", methods=["POST", "GET"])
def Login():
    if request.method == "POST":
        try:
            database = Database()
            record = database.execute(
                f"Select * From Farmers Where FarmerID=? and Password=?",
                [*request.json.values()],
            )
            if isinstance(record, str):
                print(record)
                record = database.execute(
                    f"Select * From Buyers Where BuyerID=? and Password=?",
                    [*request.json.values()],
                )
                if isinstance(record, str):
                    return jsonify(
                        {
                            "error": "Access Denied",
                            "message": "You Entered A Wrong Password or User-ID",
                            "data": None,
                        }
                    )
                else:
                    # socket.emit("join", record[0]["userID"])
                    return jsonify(
                        {
                            "error": None,
                            "message": f"Welcome Back { record[0]["Name"] }",
                            "user_type": "Buyers",
                            "data": record[0],
                        }
                    )
            else:
                # session["logged-user"] = record[0])
                # socket.emit("join", record[0]["userID"])
                return jsonify(
                    {
                        "error": None,
                        "message": f"Welcome Back { record[0]["Name"]}",
                        "user_type": "Farmers",
                        "data": record[0],
                    },
                )
        except KeyError:
            return jsonify(
                {
                    "error_type": "Posting Error",
                    "message": "Some Information Is Missing",
                }
            )

        except ValueError as e:
            return jsonify({"error type": f"Error Occured In DB -> { e }"})

        except Exception as exc:
            return jsonify(
                {
                    "message": "An Unexpeccted Error Occured",
                    "Error": f"Unknown Error Occured {exc}",
                }
            )

        finally:
            del database

    return render("login.html")


@socket.on("login")
def Login(data):
    SocketLogin(data, socket)
# Registration Process
@app.route("/register", methods=["GET", "POST"])
def Register():
    if request.method == "POST":
        newUser = filter( lambda data : data != "Farmers" | data != "Buyers", request.form.values())
        try:
            sql_statement = f"""
                Insert Into  { request.form["user-type"] }
                Values(
                ?,?,?,?,?,?,?,?
                );
            """
            database = Database()
            record = database.execute(sql_statement, newUser)

            return jsonify(
                {
                    "message": f"New { request.form["user-type"] }, { request.form["full-name"] } Pending, Verification Code Sent to { request.form["contact"] }",
                    "error": f"{ record }"
                }, toJSON(record=record)
            )

        except KeyError as e:
            return jsonify({ "error" : e })
        except Exception as e:
            return jsonify({ "error": f"An Unexpected Erroe Occured: {str(e)}"})

    return render("register.html")

# Registration Confirmation Email Sent
@app.route("/confirm-registeration", )
def Confirm():
    try:
        recipient = request.form['email']
        subject = request.form['subject']
        message_body = request.form['message']

        #the message
        msg = Message(subject, recipients=[recipient])
        msg.body = message_body

        mail.send(msg)
        return f"Confirmation Email sent to {recipient}"
    except Exception as e:
        return f"Failed to send email: {str(e)}"


# User Confirmation In The Web
@app.route("/user-confirm", methods=["POST", "GET"])
def User_confirm():
    code=1524625
    if request.method == "GET":
        return render("confirm.html", confirmation_code=code, name="Genious Mutusva", user_type="Farmer")

    else:
        try:
            if request.form["confirmation-code"] == code:
                return redirect(URL(Register))
        except KeyError as e:
            return f"{e}"


# Update Records
@app.route("/update/<table>", methods=["POST"])
def Update_Records(table):
    try:
        update = request.json
        sql_statement = f"""
            Update { table }
            Set {update['column']}='{ update['new-value'] }'
            Where { table[:-1] if table.endswith("s") else table }ID='{ update['id']}'
        """
        database = Database()
        up = database.execute(sql_statement)

        return jsonify({
            "error" : "Hello World",
            "message": up
        })

    except KeyError as e:
        print(f"Error: { e }")
        return jsonify({ "message": "Something Went Wrong, An Item Wasn't Posted"})

    except Exception as e:
        return jsonify({ "message": "An Error Occured", "body": f"Error Body: \n { e }"})

@app.route("/sign-out", methods=["POST"])
def SignOut():
    data = request.json
    try:
        sql_statement : str = f"""
            Delete From { data["user_type"]}
            Where { "FarmerID" if data["user_type"] == "Farmers" else "BuyerID"}={ data["user_id"] }
        """
        database = Database()
        database.execute(sql_statement)

    except KeyError as e:
        return jsonify({ "error": f"Request Had Incomplete Information, { e }"})

    except Exception:
        return jsonify({ "error" : "An Unexpected Error Occured"})

@app.route("/produce-add", methods=["POST"])
def ProduceStoreAdd():
    produce = [*request.json.values()]
    print(request.json)
    try:
        sql_statement : str = """
            Insert Into Produce
            Values(?, ?, ?, ?, ?, ?)
        """

        database = Database()
        status : str = database.execute(sql_statement, [creation("produce", *regex.findall("[A-Z]", request.json["user_id"])), *produce])
        print(status)
        return jsonify({
            "error": status,
            "message": "addititon process was succesful".capitalize(),
            "data": None,
        })

    except TypeError as e:
        print(e)
        return jsonify({"error" : f"{e}"})
    except Exception as e:
        print(e)
        return jsonify({"error": "Unexpected Error occured"})

@app.route("/delete-produce/<produce_id>")
def ProduceStoreDelete(produce_id):
    try:
        sql_statement : str = """
            Delete From Produce
            Where ProduceID=?
        """
        database = Database()
        x = database.execute(sql_statement, [produce_id])
        print(x)
        return jsonify({ "error": x})

    except TypeError as e:
        return jsonify({"error": f"{e}"})
    except Exception:
        return jsonify({"error": "Unexpected Error Occured"})


@socket.on("delete-from-store")
def ProduceStoreDelete(produce_id):
    try:
        sql_statement : str = """
            Delete From Produce
            Where ProductID==?
        """
        database = Database()
        result = database.execute(sql_statement, [produce_id])
        print("hello deleting stuff here", produce_id, "Result ->> ", result, end="\n\n", sep="\t")

    except TypeError as e:
        return jsonify({"error": f"{e}"})
    except Exception:
        return socket.emit("error-ocurred", {"error": "Unexpected Error Occured"})


@app.route("/get/<params>", methods=["GET", "POST"])
def Get(params : str):
    try:
        database = Database()
        if request.method == "GET":
            sql_statement = """
                Select * From {}

            """
            data = database.execute(
                sql_statement.format(params)
            )

        else:
            sql_statement = """
                Select * From {}
                Where FarmerID=?
            """
            data = database.execute(
                sql_statement.format(params), [request.json["id"]]
            )
        return jsonify(
            {
                "error": "Response",
                "message": data if isinstance(data, str) else None,
                "data": [row for row in data] if not isinstance(data, str) else None
            }
        )

    except Exception as e:
        return jsonify({
            "error_type": str(e.args[0]),
            "message": str(e.args)
        })


@app.route("/search/<query>")
def Search(query : str):
    try:
        sql_statement = """
            Select * From Farmers
            Where FarmerName Like ? or FarmerContact Like ? or Location Like ? or MainCrop Like ? or AdditionalCrops Like ?
            Union
            Select * From Buyers
            Where BuyerName Like ? or BuyerContact Like ? or Location Like ? or MainCrop Like ? or AdditionalCrops Like ?
            Union
            Select * From Produce
            Where ProduceType Like ?
        """

        if request.method == "POST":
            columns = request.json

            sql_statements = [
                f"""
                    Select * From { column }
                    Where Concat(Location, MainCrop, AdditionalCrops) Like ?
                """
                for column in columns.values()
            ]

            results = [
                database.execute(sql, [f"%{query}%"] * sql.count("?"))
                for sql in sql_statements
            ]

        database = Database()
        results = [database.execute(sql, [f"%{query}%"] * sql.count("?")) for sql in sql_statement.split("Union")]
        print("Results -> ", results)
        if not isinstance(results, str) or results:
            return jsonify({
                "error": None,
                "message": f"Found {results} Results",
                "data" : results
            })

        raise ValueError(results)

    except KeyError as exc:
        return jsonify({
            "error": "Request Error",
            "message": "Please Provide Filter Information",
            "data": None
        })

    except Exception as e:
        print("Results -> ", str(e))
        return jsonify({
            "error": "An Error Occurred",
            "message": f"Unexpected Error Occured, { e }",
            "data": None
        })


@app.route("/image")
def send_image():
    return  image("static/hb3.png", mimetype="image/png")


@app.route("/session")
def getSession():
    try:
        logged_user = session["logged-user"]
        return jsonify({
            "error" : None,
            "message": "Successful Session Get 200",
            "data": logged_user
        })

    except KeyError as e:
        return jsonify({
            "error": "Session Not FFound",
            "message": f"{ e }",
            "data" : None
        })

    except Exception as e:
        return jsonify(error)


@app.route("/gallery/<user_id>", methods=["POST"])
def Gallery(user_id : str):
    store_dir = OS.path.join( OS.getcwd(), "static/images/ProduceStore")
    if OS.path.isdir(store_dir):
        try:
            OS.chdir(store_dir)
            OS.mkdir(user_id)
            images = request.json.values()
            for image in images:
                with open(OS.path.join(OS.getcwd(), user_id, secure_filename(image.split("/")[-1])), "wb") as folder:
                    response = requests.get(image)
                    folder.write(response.content)

        except FileExistsError as exists:
            files = filter( lambda file : file.is_file() , OS.scandir(OS.path.join(store_dir, user_id)))
            if len(files) < 4:
                free_slots = 4 - len(files)
                if len(request.json.values()) > free_slots:
                    return jsonify({
                        "error": "It Seem You Already Have { len(files) } images in the Store",
                        "message": f"""
                           If You Proceed some images will not be uploaded to the store
                        """,
                        "data": None
                    })

                else:
                    for image in request.json.values():
                        with open(OS.path.join(OS.getcwd(), user_id, secure_filename(image.split("/")[-1])), "wb") as folder:
                            response = requests.get(image)
                            folder.write(response.content)


# Attempt At Sending Multiple Images Using Said Multi-Part Response -> Not Tested
@app.route("/get-gallery-images/<user_id>")
def GetImages(user_id):
    try:
        images = filter(lambda image : image.is_file(), OS.scandir(OS.path.join(OS.getcwd(), "static/images/ProduceStore", user_id)))
        if len(images) > 0:
            response = Response()
            response.headers["Content-Type"] = """
                multipart/mixed;
                boundary={}
            """.format(boundary)

            for image in images:
                with open(image, "rb") as img:
                    response.response.append(f"""
                        --{ boundary }
                        Content-Type: image/jpeg,
                        Content-Disposition: attachment,
                        filename: { image },
                        [{ img.read() }]
                        --{ boundary }
                    """)
            return response

        else:
            raise FileNotFoundError()

    except FileNotFoundError as exc:
        return jsonify({
            "error": "No Produce Images",
            "message": "😊",
            "data": None
        })

    except Exception as e:
        return jsonify({
            "error": "No Produce Images",
            "message": f"{e}",
            "data": None
        })

@app.route("/display-all")
def Display():
    images = OS.scandir(OS.path.join(OS.getcwd(), "static/images/ProduceStore/63-3128050 M 07"))
    return jsonify(OS.listdir(
        OS.path.join(OS.getcwd(), "static/images/ProduceStore/63-3128050 M 07")
    ))


@app.route("/image-get/<folder>", methods=["POST", "GET"])
def StoreImage(folder):
    gallery = list()
    gallery_dict = dict()
    img = OS.listdir(
        OS.path.join(OS.getcwd(), "static/images/ProduceStore/63-3128050 M 07", folder)
    )
    images = OS.scandir(
        OS.path.join(OS.getcwd(), "static/images/ProduceStore/63-3128050 M 07", folder)
    )
    for imge in images:
        gallery.append(imge)

    for i, pic in enumerate(gallery):
        gallery_dict.update(
            {
                img[gallery.index(pic)]: pic
            }
        )

    return image(gallery_dict[img[2]], mimetype="image/jpeg")


@socket.on("get-by-Table_Column")
def GetColumn(data):
    GetSocketColumn(data, socket)


@socket.on("join")
def handle_join(data):
    print("joining as ", data.get("name", "HarvestHub"))
    room = data.get("id", "63-3128050 M 07")
    join_room(room)
    print(f"New User joined room {room}")


@app.route("/get/<table>/<column>/<id>")
def getColumn(table, column, id):
    print(column)
    sql = """
        Select {} From {}
        Where {}ID = ?
    """.format(
        column,
        table,
        (
            "senderID"
            if table == "ChatMessages"
            else table[:-1] if table.endswith("s") else table
        ),
    )
    print(sql)

    database = Database()
    result = database.execute(sql, [id])
    socket.emit("get-found", {"error": None, "message": "Found It", "data": result})
    return jsonify(
        {"error": None, "message": "Found It", "data": result }
    )

@socket.on("contact")
def Hello():
    print("Thing Arriveed", end="\n\n\n\n")
    socket.emit("hello", "Genious")


def ManageUpdates():
    global old_version, curr_version

    try:
        database = Database()

        tables = database.execute(
            """
            SELECT OBJECT_NAME(object_id)
            FROM sys.change_tracking_tables;
        """
        )

        primary_keys = [
            database.execute(
                """
                SELECT COLUMN_NAME
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                WHERE TABLE_NAME = ?
                AND OBJECTPROPERTY(OBJECT_ID(CONSTRAINT_SCHEMA + '.' + CONSTRAINT_NAME), 'IsPrimaryKey') = 1;
            """,
                [table] )[0] for table in tables
        ]

        if old_version == 0:
            old_version = database.version()

        while not stop_event.is_set():
            curr_version = database.version()

            # Prepare queries
            get_updates = [
                f"""
                    SELECT T.*, CT.SYS_CHANGE_OPERATION
                    FROM CHANGETABLE(CHANGES {table}, {old_version}) AS CT
                    LEFT JOIN {table} AS T ON CT.{primary_keys[tables.index(table)]} = T.{primary_keys[tables.index(table)]}
                """
                for table in tables
            ]

            updates = [database.execute(query) for query in get_updates]

            if curr_version > old_version:
                old_version = curr_version  # Update the version

                # Filter out errors
                updatings = list(
                    filter(lambda update: not isinstance(update, str), updates)
                )
                for row in updatings:
                    print(row)
                    if "contractID" in row:
                        socket.emit("update-contracts", row)
                        print("Upadated >>>> ",  row)
                    elif "produceID" in row:
                        print("Upadated >>>> ", row)
                        socket.emit("update-produce", row)
                    elif "requestID" in row:
                        socket.emit("update-request", row)
                        print("Upadated >>>> ", row)

                    elif "_id" in row[0].keys():
                        print("Upadated >>>> ", row)
                        socket.emit("update-messages", row)

                print(f"Old Version: {old_version}, Current Version: {curr_version}")
                socket.emit("new-updates", updatings)
            time.sleep(2)

    except Exception as e:
        print(f"Error in ManageUpdates: {e}")


@socket.on("send-message")
def sendMessage(data):
    print("Message Sent", data)
    destination = data["receiver"]
    message = data["message"]
    try:
        sql_statement = f"""
            Insert Into ChatMessages
            Values(?, ?, ?, ?, ?, ?)
        """

        database = Database()
        print(*message.keys(), sep="\n")
        newMessage = {
            "id": message["_id"],
            "sender": message["user"]["_id"],
            "receiver": data["receiver"],
            "created": message["createdAt"],
            "message": message["text"],
            "Read" : 0

        }

        print("New Message Formated => ", newMessage)
        sent = database.execute(sql_statement, [*newMessage.values()])
        print(sent) if sent != "Insertion Succesful" else socket.send(message, to=destination)

    except Exception as e:
        print("send-error", f"Error Occured While Sending Message \n\t {e}")

@app.route("/getChats/<type>/<id>")
def getChats(type,id):
    socket.emit("event-works", "Event Is Working");
    try:
        sql_statement = f"""
            Select messageID, recieverID,  createdAt, message from ChatMessages
            Where { type }=?
        """
        database = Database()
        chats = database.execute(sql_statement, [id])
        if isinstance(chats, str):
            return jsonify({
                "error": "An Error Occurred",
                "messsage": chats,
                "data": None
            })

        return jsonify({
            "error": None,
            "message": None,
            "data": chats
        })
    except Exception as e:
        print(f"Hello There An That Error Occur {e}")


@socket.on("connect")
def SocketConnected():
    StartBackgroundThread(ManageUpdates=ManageUpdates)
    socket.emit("connected", "Socket Connected")


@app.route("/generic", methods=["POST"])
def Generic():
    try:
        database = Database()
        result = database.execute(request.json["query"], request.json["parameters"])

        print(request.json["query"], "Result >>>>>>", result[-1])
        return jsonify({
            "error": None,
            "message": f"Search For { result }",
            "data": None if isinstance(result, str) else result
        })
    except Exception as exc:
        x = f"Failed To Get { exc }, ==>> { request["query"] }"
        return jsonify({
            "error": x
        })

@app.route("/getChatItem/<sender>/<table>")
def getChatItem(sender, table):
    item = "Farmers" if table == "Buyers" else "Buyers"
    sql_statement = f"""
        SELECT TOP 1 U.{ item[:-1] }ID, U.{ item[:-1] }Name, C.Message, C.CreatedAt
        FROM ChatMessages C
        INNER JOIN { item } U ON C.senderID = U.{ item[:-1] }ID
        WHERE C.recieverID = ?
        ORDER BY C.CreatedAt DESC;
    """

    database = Database()
    result = database.execute(sql_statement, [sender])
    return jsonify({
        "error": None,
        "message": f"Search For { result }",
        "data": result
    })


@socket.on("disconnect")
def SocketDisconnected():
    if len(list(socket.server.manager.rooms)) == 0:
        StopBackgroundThread()
if __name__ == "__main__":
    socket.run(app, port=5000, debug=True)
