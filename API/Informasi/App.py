from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from datetime import timedelta


app = Flask(__name__)

app.config['MYSQL_HOST'] = 'mysql-fadli-nugasteros13-34d8.a.aivencloud.com'
app.config['MYSQL_USER'] = 'avnadmin'
app.config['MYSQL_PASSWORD'] = 'AVNS_N-eCHnPZRBPD8b9tYdR'
app.config['MYSQL_DB'] = 'datawisata'
app.config['MYSQL_PORT'] = 13582 
mysql = MySQL(app)

def format_timedelta(td):
    total_seconds = td.total_seconds()
    hours = int(total_seconds // 3600)
    minutes = int((total_seconds % 3600) // 60)
    seconds = int(total_seconds % 60)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

@app.route('/')
def root():
    return 'Informasi Pariwisata Ada Disini'

@app.route('/informasiwisata' , methods=['GET'])
def informasi():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM wisata")
    wisata_rows = cursor.fetchall()
    columns = [col[0] for col in cursor.description]
    wisata = []
    for row in wisata_rows:
        row_data = dict(zip(columns, row))
        row_data['open'] = format_timedelta(row_data['open'])  
        row_data['close'] = format_timedelta(row_data['close'])  
        row_data['waktu_buka'] = format_timedelta(row_data['waktu_buka'])  
        wisata.append(row_data)

    cursor.close()
    return jsonify(wisata)  


@app.route('/cariwisata', methods=['GET'])
def cari_wisata_by_nama():
    nama_wisata = request.args.get('nama')  
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM wisata WHERE nama_wisata LIKE %s", ('%' + nama_wisata + '%',))
    columns = [col[0] for col in cursor.description]  
    wisata_rows = cursor.fetchall()

    wisata = []
    for row in wisata_rows:
        row_data = dict(zip(columns, row))
        row_data['open'] = format_timedelta(row_data['open'])  
        row_data['close'] = format_timedelta(row_data['close'])  
        row_data['waktu_buka'] = format_timedelta(row_data['waktu_buka'])  
        wisata.append(row_data)

    cursor.close()
    return jsonify(wisata)

@app.route('/createwisata', methods=['POST'])

def create_wisata():
    data = request.get_json()
    cursor = mysql.connection.cursor()
    cursor.execute(
        "INSERT INTO wisata (nama_wisata, lokasi, deskripsi, open, close, waktu_buka) VALUES (%s, %s, %s, %s, %s, %s)",
        (data['nama_wisata'], data['lokasi'], data['deskripsi'], data['open'], data['close'], data['waktu_buka'])
    )
    mysql.connection.commit()
    cursor.close()
    return jsonify({"message": "Wisata created successfully"}), 201

@app.route('/updatewisata', methods=['PUT'])

def update_wisata():
    data = request.get_json()
    parameter = request.args.get('parameter')
    value = request.args.get('value')

    query = "UPDATE wisata SET nama_wisata=%s, lokasi=%s, deskripsi=%s, open=%s, close=%s, waktu_buka=%s WHERE " + parameter + "=%s"
    values = (data['nama_wisata'], data['lokasi'], data['deskripsi'], data['open'], data['close'], data['waktu_buka'], value)

    cursor = mysql.connection.cursor()
    cursor.execute(query, values)
    mysql.connection.commit()
    cursor.close()
    return jsonify({"message": "Wisata updated successfully"})

@app.route('/deletewisata', methods=['DELETE'])

def delete_wisata():
    parameter = request.args.get('parameter')
    value = request.args.get('value')

    query = "DELETE FROM wisata WHERE " + parameter + "=%s"

    cursor = mysql.connection.cursor()
    cursor.execute(query, (value,))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"message": "Wisata deleted successfully"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port =5000, debug=True)
