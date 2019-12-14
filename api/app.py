from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def hello_world():
    return jsonify({"data": 'Hello World!'})


if __name__ == '__main__':
    app.run()
