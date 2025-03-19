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
            return f"Failed To Connect To DB { this.DATABASE }"

        except Exception as e:
            return f"An Unexcepted Error Occured: { e }"

    def execute(this, sql : str, columns=[]) -> list:
        try:
            with this.connect() as conn:
                with conn.cursor() as connection:
                    connection.execute(sql, *columns)
                    if "Insert" in sql:
                        return "Insertion Succesful"
                    elif "Select" in sql:
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
            return f"Unexpected Error Occured:" f"{ e }"


    def switch(this, statement : str, record : list) -> dict:
        if "Buyers" in statement or "Farmers" in statement:
            return this.jsonify(record)

        elif "Contracts" in statement:
            return this.jsonify(record, "contracts")

        elif "Produce" in statement:
            return this.jsonify(record, "produce")

        else:
            print(statement)


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


