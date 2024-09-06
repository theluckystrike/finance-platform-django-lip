import sqlite3
con = sqlite3.connect('db.sqlite3')
def sql_fetch(con):
    cursorObj = con.cursor()
    #cursorObj.execute('SELECT name from sqlite_master where type= "table"')

    #cursorObj.execute('DELETE FROM scriptupload_category;')
    #cursorObj.execute('DELETE FROM scriptupload_category where id=5;')
    #cursorObj.execute('DELETE FROM scriptupload_category;');
    #print('We have deleted', cursorObj.rowcount, 'records from the table.')

    # Commit the changes to db
    #con.commit()

    cursorObj.execute('SELECT * from scriptupload_category')


    #cursorObj.execute('SELECT name from sqlite_master where type= "table"')
    print(cursorObj.fetchall())
    data = cursorObj.fetchall()
    for da in data:
        print(da.alotted,da)
sql_fetch(con)
