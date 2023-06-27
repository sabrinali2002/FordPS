import os
import openai
from llama_index import VectorStoreIndex, SimpleDirectoryReader, GPTListIndex
import requests
import json

os.environ['OPENAI_API_KEY'] = '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'

documents = SimpleDirectoryReader('documents').load_data()
index = GPTListIndex.from_documents(documents)

query_engine = index.as_query_engine()
response = query_engine.query("How much is the new Bronco?")
print(response)