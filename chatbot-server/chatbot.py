from flask import Flask, request, jsonify
from llama_index import VectorStoreIndex, SimpleDirectoryReader, GPTListIndex, StorageContext, load_index_from_storage, Prompt, SQLDatabase
from llama_index.indices.struct_store.sql_query import NLSQLTableQueryEngine
from sqlalchemy import URL, create_engine
from llama_index.prompts.base import Prompt
from llama_index.prompts.prompt_type import PromptType

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

CUSTOM_TEXT_TO_SQL_TMPL = (
    "Pretend you are a Ford dealership chatbot. Talk about Ford in collective first person. \n"
    "We have provided context information and instructions below: \n"
    "Given an input question, first create a syntactically correct {dialect} "
    "query to run, then look at the results of the query and return the answer. "
    "You can order the results by a relevant column to return the most "
    "interesting examples in the database.\n"
    "Never query for all the columns from a specific table, only ask for a "
    "few relevant columns given the question.\n"
    "Pay attention to use only the column names that you can see in the schema "
    "description. "
    "Be careful to not query for columns that do not exist. "
    "Pay attention to which column is in which table. "
    "Also, qualify column names with the table name when needed.\n"
    "Use the following format:\n"
    "Question: Question here\n"
    "SQLQuery: SQL Query to run\n"
    "SQLResult: Result of the SQLQuery\n"
    "Answer: Final answer here\n"
    "Only use the tables listed below.\n"
    "{schema}\n"
    "Question: {query_str}\n"
    "SQLQuery: "
)

CUSTOM_TEXT_TO_SQL_PROMPT = Prompt(
    CUSTOM_TEXT_TO_SQL_TMPL,
    stop_token="\nSQLResult:",
    prompt_type=PromptType.TEXT_TO_SQL,
)

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
    text_to_sql_prompt=CUSTOM_TEXT_TO_SQL_PROMPT
)

# prompt="Pretend you are a Ford dealership chatbot. Talk about Ford in collective first person. If something unrelated to Ford cars is asked, say you cannot answer. Given this information, please answer the question: \n"

@app.route('/', methods=['GET'])
def hello():
    print('get')
    return 'Hello, World!'

@app.route('/quer', methods=['POST'])
def query_model():
    data = request.get_json()
    response = query_engine.query(data['quer'])
    print(response)
    response_str = str(response)
    return jsonify({'response': response_str})


if __name__ == '__main__':
    app.run()
