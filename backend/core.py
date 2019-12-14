from flask import Flask, jsonify, request
from flask_jwt_extended import (JWTManager, create_access_token,
                                get_jwt_claims, jwt_required)
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from flask_login import LoginManager
basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
cors = CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.db')
db = SQLAlchemy(app)


app.config['JWT_SECRET_KEY'] = 'please-change-me'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.secret_key = 'xxxxyyyyyzzzzz'

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


