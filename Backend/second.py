from flask import Blueprint, render_template as render, request, jsonify
from connect import Database
from constants import createID
import re as regex

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
