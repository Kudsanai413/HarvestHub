from flask_socketio import join_room as join, send
from connect import Database
def SocketLogin(data, socket):
    if request.method == "POST" or data:
        print(data)
        try:
            database = Database()
            record = database.execute(
                f"Select * From Farmers Where FarmerID=? and Password=?",
                [*data.values()],
            )
            if isinstance(record, str):
                print(record)
                record = database.execute(
                    f"Select * From Buyers Where BuyerID=? and Password=?",
                    [*data.values()],
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
                    session_id = request.sid
                    session[session_id] = record[0]["Name"]

                    socket.emit(
                        "correct-login",
                        {
                            "error": None,
                            "message": f"Welcome Back { record[0]["Name"] }",
                            "user_type": "Buyers",
                            "data": record[0],
                            "session": session_id,
                        },
                    )
                    return jsonify(
                        {
                            "error": None,
                            "message": f"Welcome Back { record[0]["Name"] }",
                            "user_type": "Buyers",
                            "data": record[0],
                            "session": session_id,
                        }
                    )
            else:
                # session["logged-user"] = recrd[0])
                print(record)
                socket.emit(
                    "correct-login",
                    {
                        "error": None,
                        "message": f"Welcome Back { record[0]["Name"] }",
                        "user_type": "Farmers",
                        "data": record[0],
                    },
                )
                # # return jsonify(
                # #     {
                # #         "error": None,
                # #         "message": f"Welcome Back { record[0]["Name"]}",
                # #         "user_type": "Farmers",
                # #         "data": record[0],
                # #     },
                # )
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


def SocketGetColumn(data, socket):
    sql = """
        Select {} From {}
        Where {}ID = ?
    """.format(
        data.column, data.table, data.table[:-1] if data.table.endswith("s") else data.table
    )

    database = Database()
    result = database.execute(sql, [id])
    socket.emit("get-found", {"error": None, "message": "Found It", "data": result})
    return


def send_message(room, message, socket):
    try:
        sql_statement = f""""
            Insert Into ChatMessages(messageID, senderID, recieverID, createdAT, message)
            Values(?, ?, ?, ?, ?)
        """

        database = Database()
        sent = database.execute(sql_statement, [*message.values()])
        raise Exception(sent) if sent != "Insertion Successful" else socket.to(room).emit("recieve-message", message)

    except Exception as e:
        socket.emit("send-error", f"Error Occured While Sending Message \n\t {e}")
