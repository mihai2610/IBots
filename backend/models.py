from core import db
from werkzeug.security import check_password_hash, generate_password_hash
from flask_login import UserMixin
from sqlalchemy import desc, event


ROLES_USERS = db.Table('roles_users',
                       db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
                       db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))


class User(db.Model, UserMixin):
    """
    Defines the User object.
    """
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    displayname = db.Column(db.String(120), unique=True)
    email = db.Column(db.String(120), unique=True)
    password_hash = db.Column(db.String(120))
    roles = db.relationship('Role', secondary=ROLES_USERS,
                            backref=db.backref('users', lazy='dynamic'))
    confirmed = db.Column(db.Boolean, nullable=False, default=False)
    confirmed_on = db.Column(db.DateTime, nullable=True)

    @property
    def password(self):
        """
        Raises an attribute error if password field is trying to be modified
        :return:
        """
        raise AttributeError('password: write-only field')

    @password.setter
    def password(self, password):
        """
        Sets the password
        :param password:
        :return:
        """
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """
        Checks password hash
        :param password:
        :return:
        """
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def get_by_username(username):
        """
        Returns user by username.
        :param username: username to be retrieved
        :return: User
        """
        return User.query.filter_by(username=username).first()

    def __repr__(self):
        return "<User '{}'>".format(self.username)


class Role(db.Model):
    """
    Defines the Role model
    """
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

    def __repr__(self):
        return "<Role '{}'>".format(self.name)

    def __str__(self):
        return self.name

    def __eq__(self, other):
        return (self.name == other or
                self.name == getattr(other, 'name', None))

    def __hash__(self):
        return hash(self.name)

@event.listens_for(Role.__table__, 'after_create')
def insert_initial_values(*args, **kwargs):  # pylint: disable=unused-argument
    """
    Ensures the 3 basic roles required are created
    :rtype: object
    """
    db.session.add(Role(name='Admin', description='admin'))
    db.session.add(Role(name='Contributor', description='contributor'))
    db.session.add(Role(name='User', description='regular user'))
    db.session.commit()


@db.event.listens_for(Role, "after_insert")
def get_default_role(*args, **kwargs):  # pylint: disable=unused-argument
    """
    Sets up a default role to be assigned to new users.
    :param args:
    :param kwargs:
    :return:
    """
    return Role.query.filter(Role.name == 'User').first_or_404()


