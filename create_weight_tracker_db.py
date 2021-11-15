import sqlite3, os
pathOfDb = "c:/backup/code/react-apps/weight-tracker/weighttracker.sqlite"
if os.path.exists(pathOfDb):
    os.remove(pathOfDb)
connection = sqlite3.connect(pathOfDb)
cursor = connection.cursor()

CREATE = "CREATE TABLE WEIGHT_TRACKER (DATE_OF_WEIGHT TEXT PRIMARY KEY NOT NULL, POUNDS REAL NOT NULL, NOTES TEXT);"
cursor.execute(CREATE)
cursor.close()
connection.close()




