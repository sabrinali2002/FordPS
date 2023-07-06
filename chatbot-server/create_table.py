from sqlalchemy import create_engine, MetaData, Table, Column, String, Integer, select, column, URL, insert
from data import models

url_obj=URL.create(
    drivername="mysql+mysqlconnector",
    username="root",
    password="OsCy)S6bTdEl9;",
    host="137.184.143.181",
    database="ford_stats"
)

engine = create_engine(url_obj)
metadata_obj = MetaData()

table_name="ford_data"

ford_table = Table(
    table_name,
    metadata_obj,
    Column("make", String(32)),
    Column("model", String(32)),
    Column("year", Integer),
    Column("trim", String(32)),
    Column("msrp", Integer, primary_key=True),
    Column("invoice", Integer),
    Column("used_new_price", Integer),
    Column("body_size", String(32)),
    Column("body_style", String(32)),
    Column("cylinders", String(32)),
    Column("engine_aspiration", String(32)),
    Column("drivetrain", String(32)),
    Column("transmission", String(32)),
    Column("horsepower", String(64)),
    Column("torque", String(64)),
    Column("highway_fuel_economy", String(32))
)

metadata_obj.create_all(engine)

for model in models:
    stmt=insert(ford_table).values(**model)
    with engine.connect() as connection:
        cursor = connection.execute(stmt)