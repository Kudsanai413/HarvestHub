const base_url : string = "http://localhost:3400";
const database : string = "http://127.0.0.1:5000"

const Request = (url : string, method_objects? : any) : Promise<string | any> =>
{
   const data = fetch(url, method_objects)
                    .then( response =>
                        {
                            if (!response.ok) throw new Error(`Backend Did'nt Sent Back A Response`);
                            return response.json();
                        }).catch( err =>
                            {
                                return {
                                    error: "Unable Reach Server",
                                    message: err.message,
                                    data: null
                                }
                            });

    return data
};

const createObject = (method: string, contents: any) : any =>
{
    return {
        method: method,
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify(contents)
    };
}


export { base_url, createObject, database, Request };