from flask import Flask, request, jsonify
from langchain.chat_models import ChatVertexAI
from langchain import PromptTemplate, LLMChain

import os
from flask_cors import CORS, cross_origin 
import sys

import yaml
import pathlib

from langchain.agents import create_json_agent, AgentExecutor
from langchain.agents.agent_toolkits import JsonToolkit
from langchain.chains import LLMChain
from langchain.llms import VertexAI
from langchain.requests import TextRequestsWrapper
from langchain.tools.json.tool import JsonSpec

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

# with open("documents/forddata.yml") as f:
#     data = yaml.load(f, Loader=yaml.FullLoader)
json_spec = JsonSpec.from_file(pathlib.Path("documents/dummy.json"))
json_toolkit = JsonToolkit(spec=json_spec)

json_agent_executor = create_json_agent(
    llm=VertexAI(temperature=0), toolkit=json_toolkit, verbose=True
)

@app.route('/', methods=['GET'])
def hello():
    print('get')
    return 'Hello, World!'

@app.route('/quer', methods=['POST'])
def query_model():
    data = request.get_json()
    response = json_agent_executor.run(data['quer'])
    print(response)
    response_str = str(response)
    return jsonify({'response': response_str})


if __name__ == '__main__':
    app.run()
