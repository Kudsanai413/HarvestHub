import random
import threading

stop_event = threading.Event()
update_thread = None
def createID(type: str, letter: str) -> str:
    match type:
        case "produce":
            length : int = random.randint(0, 9)
            p_num : int = str(random.randint(0, 999))
            number: str = (
                f"0{length}"
                if length < 10
                else {length}
            )
            count : str = p_num if len(p_num) < 5 else f"{ '0' * (5 - len(p_num)) }{ p_num }"
            return f"P{number}-{ count }{letter}"

        case "contract":
            length : int = random.randint(0, 9)
            c_num : int = str(random.randint(0, 999))
            number: str = (
                f"0{length}"
                if length < 10
                else {length}
            )
            count : str = c_num if len(c_num) < 5 else f"{ '0' * (5 - len(c_num)) }{ c_num }"
            return f"C{number}-{ count }{letter}"

        case "request":
            length : int = random.randint(0, 9)
            req_num : int = str(random.randint(0, 999))
            number: str = (
                f"0{length}"
                if length < 10
                else {length}
            )
            count : str = req_num if len(req_num) < 5 else f"{ '0' * (5 - len(req_num)) }{ req_num }"
            return f"R{number}-{ count }{letter}"


        case _:
            return "Unrecognized Action"

def additional(text : str) -> list[str]:
    if ',' in text:
        return [ crop.strip() for crop in text.split(",") ]

    else:
        return [text] if "Null" not in text else []

def format_name( name : str) -> str:
    try:
        new = name.split(' ')[::-1]
        formated_name = map( lambda wrd: wrd[0], new)
        return  f"{ formated_name[0] } .{ formated_name[:1]}"

    except Exception as e:
        print(f"{ e }")


tables: tuple[str] = ("Farmers", "Buyers", "Produce", "Contracts", "Profiles")
columns: tuple[str] = ("FarmerName", "BuyerName", "Description", "ProduceType", "Agreement")
parameters : dict[str, tuple[str]] = {
    "tables" : tables,
    "columns": columns
}


default_error_response = {
    "error": "Error",
    "message" : "An Unexpected Error Occured",
    "data" : None
}

def column(name : str ) -> str:
    try:
        if not isinstance(name, str) : raise ValueError()
        if "contract" in name.lower():
            return "Agreement_Terms"

        elif "produce" in name.lower():
            return "ProduceType"

        else:
            return ""

    except ValueError:
        return f" Expected Arguement Of Type -> str nut instead got { type(name) }"


sql = """
    Select {} From {}
    Where {}ID = ?
""".format(
    columns[2], tables[1], tables[2][:-1] if tables[2].endswith("s") else tables[2]
)


def StartBackgroundThread(ManageUpdates):
    """Start the update tracking thread if not already running."""
    global update_thread
    if update_thread is None or not update_thread.is_alive():
        stop_event.clear()
        update_thread = threading.Thread(target=ManageUpdates, daemon=True)
        update_thread.start()
        print("Background update thread started!")


def StopBackgroundThread():
    """Stop the background update thread when all clients disconnect."""
    global stop_event, update_thread
    stop_event.set()
    if update_thread:
        update_thread.join()
    update_thread = None
    print("Background update thread stopped!")
