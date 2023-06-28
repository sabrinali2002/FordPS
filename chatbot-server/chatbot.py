from flask import Flask, request, jsonify
from llama_index import VectorStoreIndex, SimpleDirectoryReader, GPTListIndex, StorageContext, load_index_from_storage, Prompt
import os

os.environ['OPENAI_API_KEY'] = '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'

app = Flask(__name__)


documents = SimpleDirectoryReader('documents').load_data()
# index = GPTListIndex.from_documents(documents)

#Persist index in local storage
# index.storage_context.persist()
storage_context = StorageContext.from_defaults(persist_dir="./storage")
index = load_index_from_storage(storage_context)

TEMPLATE_STR = (
    "Pretend you are a Ford dealership chatbot. Talk about Ford in collective first person. If something unrelated is asked, say you cannot answer."
    "We have provided context information below. \n"
    "---------------------\n"
    "{context_str}"
    "\n---------------------\n"
    "Given this information, please answer the question: {query_str}\n")

QA_TEMPLATE = Prompt(TEMPLATE_STR)

query_engine = index.as_query_engine(text_qa_template=QA_TEMPLATE)

@app.route('/', methods=['GET'])
def hello():
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
