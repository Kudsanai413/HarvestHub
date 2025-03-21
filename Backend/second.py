from flask import Blueprint, render_template as render, request, jsonify
from connect import Database
from constants import createID
import re as regex
import datetime as time

web_app = Blueprint("admin", __name__, static_folder="static", template_folder="templates")

@web_app.route("/", methods=["GET", "POST"])
def Contracts():
    if request.method == "POST":
        sql = """
            Insert Into Contracts(
                ContractID,
                FarmerID,
                BuyerID,
                Duration,
                Status,
                Agreement_Terms
            )
            Values(
                ?,?,?,?,?,?
            )
        """

        database = Database()
        try:
            result = database.execute(
                sql,
                [
                    createID("contract", *regex.findall("[A-Z]", request.form["USER-ID"])),
                    *request.form.values()
                ],
            )
            print(f"{result} Hello From Server")
        except Exception as e:
            return jsonify(
                {
                    "error": "Unexpected Error",
                    "message": f"Error =>> { e }",
                    "data": None
                }
            )

    return render("contracts.html")


@web_app.route("/requests", methods=["POST", "GET"])
def Request():
    try:
        if request.method == "POST":
            sql: str = """
                Insert INTO requests (RequestID, buyerID, farmerID, crop, quantity, price, status, created_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, GETDATE());
            """
            status : str = "Pending"
            date = f"{time.date.year}/{ time.date.month }-{ time.date.day }"
            database = Database()
            result = database.execute(sql, [ createID("request", *regex.findall("[A-Z]", request.json["farmer"])),*request.json.values()])
            return jsonify({
                "error": "Request To Buyer",
                "message": "Request Successfully Forwarded" if "Insertion Succesful" == result else result,
                "data" : None
            })

        return render("request.html")

    except Exception as e:
        return jsonify({
            "error": "An Error Occured",
            "message": str(e),
            "data" : None
        })

@web_app.route("/with-updates")
def WithUpdates():
    sql = """
        SELECT OBJECT_NAME(object_id)
        FROM sys.change_tracking_tables;
    """
    sql_stat = """SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_NAME = ?
        AND OBJECTPROPERTY(OBJECT_ID(CONSTRAINT_SCHEMA + '.' + CONSTRAINT_NAME), 'IsPrimaryKey') = 1;
    """


    try:
        database = Database()
        results = database.execute(sql)
        primary_keys = database.execute(sql_stat, [results[0]])
        return primary_keys

    except Exception as e:
        return f"{e}"

@web_app.route("/produce")
def AdminProduce():
    return render("AdminProduce.html")

@web_app.route("/webProduce")
def getProduce():
    try:
        database = Database()
        sql_statement = """
            Select * From Produce
        """
        data = database.execute(
            sql_statement
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