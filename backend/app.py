from typing import Dict

from flask import Flask, jsonify, request
from flask_jwt_extended import (JWTManager, create_access_token,
                                get_jwt_claims, jwt_required)
from flask_sqlalchemy import SQLAlchemy

from core import app
from models import User, Ticker
from flask_login import login_user
import os
from flask_cors import cross_origin, CORS
basedir = os.path.abspath(os.path.dirname(__file__))

jwt = JWTManager(app)
cors = CORS(app)

# should get the user from a db or something else
users_passwords = {'admin': 'admin', 'user': 'user'}
users_claims: Dict[str, Dict[str, str]] = {
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

from sentalyzer import processing

print(processing.get_sentiment_aggregates('GOOG'))

@jwt.user_claims_loader
def add_claims_to_access_token(identity):
    return users_claims[identity]


@app.route('/api/login', methods=['POST'])
@cross_origin()
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
    if _user is None:
        return jsonify({'msg': 'Bad username or password'}), 401

    if _user is not None and _user.check_password(password):
        login_user(_user)
        access_token = create_access_token(identity=username)
        return jsonify({'access_token': access_token}), 200



@app.route('/api/protected', methods=['GET'])
@cross_origin()
@jwt_required
def protected():
    claims = get_jwt_claims()
    result = []
    tickers = Ticker.query.all()
    for ticker in tickers:
        result.append({
            "id": ticker.id,
            "name": ticker.name,
            "description": ticker.description
        })
    if claims.get('username') == 'admin':
        return jsonify({'data': result}), 200
    return jsonify({'msg': 'No access for you!'}), 400


@app.route('/api/ticker/<id>', methods=['GET'])
@cross_origin()
@jwt_required
def ticker_by_id(id):
    claims = get_jwt_claims()
    ticker = Ticker.query.filter(Ticker.id == id).first()
    result = {
        "id": ticker.id,
        "name": ticker.name,
        "description": ticker.description
    }
    sentiment = processing.get_sentiment_aggregates(ticker.name)

    if claims.get('username') == 'admin':
        return jsonify({'data': result, 'sentiment': sentiment}), 200

    return jsonify({'msg': 'No access for you!'}), 400


@app.route('/api/sentiment/ticker/<id>', methods=['GET'])
@cross_origin()
@jwt_required
def sentiment_ticker_by_id(id):
    claims = get_jwt_claims()
    ticker = Ticker.query.filter(Ticker.id == id).first()
    sentiment = processing.get_sentiment_aggregates(ticker.name)

    result = {
        "id": ticker.id,
        "name": ticker.name,
        "description": ticker.description
    }
    if claims.get('username') == 'admin':
        return jsonify({'data': result}), 200

    return jsonify({'msg': 'No access for you!'}), 400

if __name__ == '__main__':
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run()
