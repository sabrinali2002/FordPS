from flask import Flask, request, jsonify
<<<<<<< HEAD
from llama_index import VectorStoreIndex, SimpleDirectoryReader, GPTListIndex, StorageContext, load_index_from_storage, Prompt, SQLDatabase
from llama_index.indices.struct_store.sql_query import NLSQLTableQueryEngine
from sqlalchemy import URL, create_engine
=======
from llama_index import VectorStoreIndex, SimpleDirectoryReader, GPTListIndex, StorageContext, load_index_from_storage, Prompt
>>>>>>> main

import os
from flask_cors import CORS, cross_origin 
import sys

os.environ['OPENAI_API_KEY'] = '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'

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS']='Content-Type'

# documents = SimpleDirectoryReader('documents').load_data()
# index = GPTListIndex.from_documents(documents)

# #Persist index in local storage
# index.storage_context.persist()
# storage_context = StorageContext.from_defaults(persist_dir="./storage")
# index = load_index_from_storage(storage_context)

# TEMPLATE_STR = (
#     "Pretend you are a Ford dealership chatbot. Talk about Ford in collective first person. If something unrelated is asked, say you cannot answer."
#     "We have provided context information below. \n"
#     "---------------------\n"
#     "{context_str}"
#     "\n---------------------\n"
#     "Given this information, please answer the question: {query_str}\n")

# QA_TEMPLATE = Prompt(TEMPLATE_STR)

url_object = URL.create(
    "mysql+mysqlconnector",
    username="root",
    password="OsCy)S6bTdEl9;",  # plain (unescaped) text
    host="127.0.0.1",
    database="ford_stats",
)

engine = create_engine(url_object)

sql_database = SQLDatabase(engine, include_tables=["car_info"])
query_engine = NLSQLTableQueryEngine(
    sql_database=sql_database,
    tables=["car_info"],
)

prompt="Pretend you are a Ford dealership chatbot. Talk about Ford in collective first person. If something unrelated to Ford cars is asked, say you cannot answer. Given this information, please answer the question: \n"

@app.route('/', methods=['GET'])
def hello():
    print('get')
    return 'Hello, World!'

@app.route('/quer', methods=['POST'])
def query_model():
    data = request.get_json()
    response = query_engine.query(prompt+data['quer'])
    print(response)
    response_str = str(response)
    return jsonify({'response': response_str})


if __name__ == '__main__':
    from waitress import serve
    serve(app, host="0.0.0.0", port=80)
