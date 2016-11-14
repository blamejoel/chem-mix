#!/usr/bin/env python3
# all the imports
import MySQLdb
from contextlib import closing
from flask import Flask, request, session, g, redirect, url_for, \
        abort, render_template, flash
import json

# database configuration
with open('config.json') as db_config:
    config = json.load(db_config)
DATABASE = config['db']['DATABASE']
HOST = config['db']['HOST']
PORT = config['db']['PORT']
DEBUG = config['db']['DEBUG']
SECRET_KEY = config['db']['SECRET_KEY']
USERNAME = config['db']['USERNAME']
PASSWORD = config['db']['PASSWORD']

# create our little application :)
app = Flask(__name__)
app.config.from_object(__name__)
socketio = SocketIO(app)

# function to establish a database connection
# set values from database configuration, above
def connect_db():
    return MySQLdb.connect(host=HOST, user=USERNAME, passwd=PASSWORD, 
            db=DATABASE, port=PORT)

@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

@app.route('/')
def list_entries():
    # establish a database cursor for our query
    cur = g.db.cursor()
    # execute the sql statement
    cur.execute('select top 10 name from chemicals order by name')
    print(cur.fetchall())
    # entries = [dict(id=row[0], car_number=row[1], space_number=row[2], \
    #         car_type=row[3], bike=row[4], ibis=row[5], driver=row[6]) \
    #         for row in cur.fetchall()]
    return
    # return render_template('list.html', entries=entries)

if __name__ == '__main__':
    socketio.run(app)
