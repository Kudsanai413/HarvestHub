import os
import requests
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from constants import column

app = Flask(__name__)


# Define the path to your React app's assets folder
UPLOAD_FOLDER = os.path.join(
    os.getcwd(), "frontend", "public", "assets"
)  # Update the path accordingly
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Allowable file types (for images)
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


# Function to check if the file extension is allowed
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# Endpoint to download an image and save it
@app.route("/download-image", methods=["POST"])
def download_image():
    image_url = request.json.get("image_url")

    if not image_url:
        return jsonify({"error": "No image URL provided"}), 400

    # Check if it's a URL or a local file
    if image_url.startswith("http"):
        # If it's a URL, download the image
        try:
            response = requests.get(image_url)
            if response.status_code == 200:
                filename = secure_filename(
                    image_url.split("/")[-1]
                )  # Get image filename from the URL
                file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

                with open(file_path, "wb") as f:
                    f.write(response.content)

                return (
                    jsonify(
                        {
                            "message": "Image downloaded successfully!",
                            "filename": filename,
                        }
                    ),
                    200,
                )
            else:
                return jsonify({"error": "Failed to download image from URL"}), 400
        except requests.RequestException as e:
            return jsonify({"error": str(e)}), 500
    else:
        # If it's a local file path, copy the file to the assets folder
        if os.path.exists(image_url):
            filename = secure_filename(os.path.basename(image_url))
            file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            try:
                with open(image_url, "rb") as src_file:
                    with open(file_path, "wb") as dst_file:
                        dst_file.write(src_file.read())
                return (
                    jsonify(
                        {"message": "Image saved successfully!", "filename": filename}
                    ),
                    200,
                )
            except Exception as e:
                return jsonify({"error": f"Failed to save local file: {str(e)}"}), 500
        else:
            return jsonify({"error": "Local file does not exist"}), 400

@app.route("/search/<query>", methods=["POST", "GET"])
def Search(query):
    while request.method == "POST":
        try:
            columns = request.json
            sql_statements = [f"""
                Select * From { columns.values()[name]}
                Where { column(columns.values()[name]) } Like ?
            """ for name in columns.values()]
        except KeyError as e:
            print(e)

if __name__ == "__main__":
    app.run(debug=True)
