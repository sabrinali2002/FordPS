from flask import Flask, request, jsonify
from langchain.llms import VertexAI
from langchain import PromptTemplate, LLMChain

import os
from flask_cors import CORS, cross_origin 
import sys

from langchain.agents import create_spark_sql_agent
from langchain.agents.agent_toolkits import SparkSQLToolkit
from langchain.chat_models import ChatOpenAI
from langchain.utilities.spark_sql import SparkSQL
from pyspark.sql import SparkSession

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS']='Content-Type'

# TEMPLATE_STR = (
#     "Pretend you are a Ford dealership chatbot. Talk about Ford in collective first person. If something unrelated is asked, say you cannot answer."
#     "We have provided context information below. \n"
#     "---------------------\n"
#     "{context_str}"
#     "\n---------------------\n"
#     "Given this information, please answer the question: {query_str}\n")

# QA_TEMPLATE = Prompt(TEMPLATE_STR)

# prompt="Pretend you are a Ford dealership chatbot. Talk about Ford in collective first person. If something unrelated to Ford cars is asked, say you cannot answer. Given this information, please answer the question: \n"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "documents/auth.json"

spark = SparkSession.builder.getOrCreate()
schema = "ford"
spark.sql(f"CREATE DATABASE IF NOT EXISTS {schema}")
spark.sql(f"USE {schema}")
csv_file_path = "documents/all_ford_data.csv"
table = "cars"
spark.read.csv(csv_file_path, header=True, inferSchema=True).write.saveAsTable(table)
# spark.table(table).show()

spark_sql = SparkSQL(schema=schema)
llm = VertexAI()
toolkit = SparkSQLToolkit(db=spark_sql, llm=llm)
agent_executor = create_spark_sql_agent(llm=llm, toolkit=toolkit, verbose=True)

# document = JSONDocument('documents/csvjson.json')
# chain = LLMChain(llm=llm)

@app.route('/', methods=['GET'])
def hello():
    print('get')
    return 'Hello, World!'

@app.route('/quer', methods=['POST'])
def query_model():
    data = request.get_json()
    response = agent_executor.run(data['quer'])
    print(response)
    response_str = str(response)
    return jsonify({'response': response_str})


if __name__ == '__main__':
    app.run()
