from flask import Flask, request, jsonify
from llama_index import VectorStoreIndex, SimpleDirectoryReader, GPTListIndex, StorageContext, load_index_from_storage
import os

os.environ['OPENAI_API_KEY'] = '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'

app = Flask(__name__)


documents = SimpleDirectoryReader('documents').load_data()
# index = GPTListIndex.from_documents(documents)

#Persist index in local storage
# index.storage_context.persist()
storage_context = StorageContext.from_defaults(persist_dir="./storage")
index = load_index_from_storage(storage_context)

query_engine = index.as_query_engine()

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
