import { UserType } from "@/Context/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, isToday, isYesterday } from "date-fns";

function formatName( name : string ) : string
{
    let formatted_name : string = ""
    const the_name : string[] = name.split(" ");
    the_name.map( (word : string) => the_name.indexOf(word) < the_name.length - 1 ? formatted_name += `${word.charAt(0)} .` : formatted_name += word);
    return formatted_name;
}

function FileReadableFormat(blobURL : Blob) : Promise<any>
{
    const reader : FileReader = new FileReader();

    return new Promise( (resolve, reject) =>
    {
        reader.readAsDataURL(blobURL);
        reader.onload = () => resolve(reader.result);
        alert(reader.readAsText(blobURL))
        reader.onerror = (error) => reject(error)
    });

}

async function getSession(text?: string)
{
    console.clear();
    try
    {
        const user  = text ? await AsyncStorage.getItem(text) :  await AsyncStorage.getItem("session");
        const logged : UserType | null = user !== null ? JSON.parse(user) : null;
        if (logged !== null) return logged;
        else throw new Error("Nothing Was Found");
    }

    catch (exc : any)
    {
        if (exc.message === "Nothing Was Found" && text ) createSession(undefined, text, []);
        else if (exc.message === "Nothing Was Found" && !text) createSession(null);
        console.log(exc.message);
        return null

    }

}

async function createSession( user? : UserType | null, text?: string, item?: string[] ) : Promise<void>
{
    console.log("qwertyuiop")
    try
    {
        user ? await AsyncStorage.setItem("session", JSON.stringify(user))
            :text && item ? await AsyncStorage.setItem("session", JSON.stringify(user))
                : (() => {
                    console.clear();
                    console.log(`Cannot Create Empty Item In Storage`)
                })
    }
    catch (error)
    {
        AsyncStorage.clear();
        console.error(error);
    }
}

function type_of(object : any, type : string) : boolean
{
    return Object.keys(object).includes(type)
}


const formatDate = (dateString: string): string => {
  const date: Date = new Date(dateString);

  if (isToday(date)) {
    return format(date, "h:mm a");
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return format(date, "MMM d, yyyy");
  }
};

export { createSession, formatName, FileReadableFormat, getSession, type_of, formatDate }