from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# AI model code
from llama_index import VectorStoreIndex, SimpleDirectoryReader, GPTListIndex
import os

os.environ['OPENAI_API_KEY'] = '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'

documents = SimpleDirectoryReader('documents').load_data()
index = GPTListIndex.from_documents(documents)

query_engine = index.as_query_engine()

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/quer', methods=['POST'])
def query_model():
    data = request.get_json()
    response = query_engine.query(data['quer'])
    print(response)
    response_str = str(response)  # Convert to string if the response is not a string

    # Return the response as a valid response type
    return jsonify({'response': response_str})
   # user_query = data['quer']

    # Query your AI model or perform any other processing

    #return jsonify({'response': 'Query received', 'user_query': user_query})


if __name__ == '__main__':
    app.run()
