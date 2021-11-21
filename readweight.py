from csv import reader
import sqlite3, os, sys

pathOfDb = "c:/backup/code/react-apps/weight-tracker/weighttracker.sqlite"
if not os.path.exists(pathOfDb):
	print("No database file exists at: " + pathOfDb)
	exit()

sql = "INSERT INTO WEIGHT_TRACKER(DATE_OF_WEIGHT, POUNDS, NOTES) VALUES (?, ?, ?)"
connection = sqlite3.connect(pathOfDb)
cursor = connection.cursor()

# read csv file as a list of lists
with open('SteveWeight.csv', 'r') as read_obj:
	# pass the file object to reader() to get the reader object
	csv_reader = reader(read_obj)
	# Pass reader object to list() to get a list of lists
	list_of_rows = list(csv_reader)
	print("Header Row")
	print(list_of_rows[0])
	#print(list_of_rows)
	for i in range(1, len(list_of_rows) - 1):
		currRow = list_of_rows[i]
		dt = currRow[0]
		lbs = currRow[1]
		comments = None
		try: 
			float(currRow[2])
		except ValueError:
			comments = None if len(currRow[2]) == 0 else currRow[2]
		if len(lbs) > 0:
			try:
				args = (dt, float(lbs), comments)
				print("Date: " + dt + ", Pounds: " + lbs + ", Comments: " + str(comments))
				cursor.execute(sql, args)
			except ValueError:
				continue

connection.commit()
cursor.close()
connection.close()

