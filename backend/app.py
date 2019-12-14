from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (JWTManager, create_access_token,
                                get_jwt_claims, jwt_required)
from flask_sqlalchemy import SQLAlchemy

from core import app, jwt
from models import User
from flask_login import login_user
import os
basedir = os.path.abspath(os.path.dirname(__file__))


# should get the user from a db or something else
users_passwords = {'admin': 'admin', 'user': 'user'}
users_claims = {
    'admin': {
        'username': 'admin',
        'email': 'admin@admin.org',
        'role': 'admin'
    },
    'user': {
        'username': 'user',
        'email': 'user@user.org',
        'role': 'user'
    }
}


@jwt.user_claims_loader
def add_claims_to_access_token(identity):
    return users_claims[identity]


@app.route('/api/login', methods=['POST'])
def login():
    login_json = request.get_json()

    if not login_json:
        return jsonify({'msg': 'Missing JSON'}), 400

    username = login_json.get('username')
    password = login_json.get('password')

    if not username:
        return jsonify({'msg': 'Username is missing'}), 400

    if not password:
        return jsonify({'msg': 'Password is missing'}), 400

    _user = User.get_by_username(username)
    if _user is not None and _user.check_password(password):
        login_user(_user)
        access_token = create_access_token(identity=username)
        return jsonify({'access_token': access_token}), 200

    # user_password = users_passwords.get(username)
    #
    # if not user_password or password != user_password:
    #     return jsonify({'msg': 'Bad username or password'}), 401
    #
    # access_token = create_access_token(identity=username)
    #
    # return jsonify({'access_token': access_token}), 200


@app.route('/api/protected', methods=['GET'])
@jwt_required
def protected():
    claims = get_jwt_claims()
    if claims.get('username') == 'admin':
        return jsonify({'data': ['hi', 'it', 'works']}), 200
    return jsonify({'msg': 'No access for you!'}), 400


if __name__ == '__main__':
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True, host='0.0.0.0')
