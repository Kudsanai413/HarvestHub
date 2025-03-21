import pyodbc as database
from constants import additional, format_name
class Database:
    def __init__(this):
        this.DRIVER: str = "{ODBC Driver 17 for SQL Server}"
        this.SERVER: str = "GENIOUS\\MSSQLSERVER01"
        this.DATABASE: str = "HarvestHub"
        this.USER: str = "GENIOUS\\Lenovo"
        this.Password: int = 1004
        this.conn_string: str = (
            f"DRIVER={ this.DRIVER };SERVER={ this.SERVER };DATABASE={ this.DATABASE };Trusted_Connection=yes"
        )

    def connect(this):
        try:
            return database.connect(this.conn_string)
        except database.Error as e:
            print(f"Failed To Connect To DB { this.DATABASE }")
            return f"Failed To Connect To DB { this.DATABASE }"

        except Exception as e:
            return f"An Unexcepted Error Database Occured: { e }"

    def execute(this, sql : str, columns=[]) -> list:
        try:
            with this.connect() as conn:
                with conn.cursor() as connection:
                    connection.execute(sql, *columns)
                    if "Insert" in sql:
                        return "Insertion Succesful"
                    elif "Select" in sql or "Select".upper() in sql:
                        records = connection.fetchall()
                        if len(records) == 0:
                            raise ValueError("No Record Matches The Given Data")
                        else:
                            records_found = [ this.switch(sql, row) for row in records]
                            return records_found
                    return "qWERTY"

        except database.Error as e:
            return f"Failed To Execute: { sql }->  { e }"

        except ValueError as e:
            return f"{ e }"

        except Exception as e:
            return f"Unexpected Error Occured 1234:" f"{ e }"

    def version(this):
        result = this.execute("SELECT CHANGE_TRACKING_CURRENT_VERSION();")
        return result[0] if result else 0

    def switch(this, statement : str, record : list) -> dict | str:
        if "Buyers" in statement or "Farmers" in statement:
            return this.jsonify(record)

        elif "Contracts" in statement:
            return this.jsonify(record, "contracts")

        elif "Produce" in statement:
            return this.jsonify(record, "produce")

        elif "Requests" in statement:
            return this.jsonify(record, "requests")

        elif "ChatMessages" in statement:
            return this.jsonify(record, "requests")

        elif "tables" in statement or "TABLE_NAME" in statement:
            return record[0]

        else:
            return record[0]


    def jsonify(this, record, type="user"):
        try:
            match type:
                case "produce":
                    return {
                        "produceID": record[0],
                        "farmerID": record[1],
                        "produceType": record[2],
                        "quantity": record[5],
                        "unit_type": record[4],
                        "price": record[3],
                    }

                case "contracts":
                    return {
                        "contractID": record[0],
                        "farmerID": record[1],
                        "buyerID": record[2],
                        "agreement": record[4],
                        "status": record[8],
                        "startDate": record[6],
                        "finishDate": record[7]
                    }

                case "requests":
                    return {
                        "request": record[0],
                        "farmer": record[1],
                        "buyer": record[2],
                        "crop": record[3],
                        "quantity": record[4],
                        "price": record[5] if record[5] == "negotiate" else float(record[5]),
                        "status": record[6],
                        "created": record[7]

                    }

                case "chatmessages":
                    return {
                        "messageID": record[0],
                        "sender": record[1],
                        "reciever": record[2],
                        "createdAt": record[3],
                        "message": record[4]
                    }

                case _:
                    return {
                        "userID": record[0],
                        "Name": record[1],
                        "contact": record[3],
                        "location": record[4],
                        "main_crop": record[5],
                        "Additional_crops": additional(record[6]),
                        "password": record[7],
                    }

        except IndexError as e:
            found = [ row for row in record ]
            return found


