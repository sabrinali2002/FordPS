from sqlalchemy import create_engine, MetaData, Table, Column, String, Integer, select, column, insert, URL, Text
from car_data import rows

url_object = URL.create(
    "mysql+mysqlconnector",
    username="root",
    password="OsCy)S6bTdEl9;",  # plain (unescaped) text
    host="127.0.0.1",
    database="ford_stats",
)

engine = create_engine(url_object)
metadata_obj = MetaData()

table_name = "car_info"
ford_stats_table = Table(
    table_name,
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("make", Text),
    Column("model", Text),
    Column("year", Integer),
    Column("trim", Text),
    Column("msrp", Integer),
    Column("invoice_price", Integer),
    Column("used_new_price", Integer),
    Column("body_size", Text),
    Column("body_style", Text),  
    Column("cylinders", Text),
    Column("engine_aspiration", Text),
    Column("drivetrain", Text),
    Column("transmission", Text),
    Column("horsepower", Text),
    Column("torque", Text),
    Column("highway_fuel_economy", Text)
)
metadata_obj.create_all(engine)

index=0

for row in rows:
    info=row.copy()
    info["id"]=index
    index+=1
    stmt = insert(ford_stats_table).values(**info)
    with engine.connect() as connection:
        cursor = connection.execute(stmt)
        connection.commit()