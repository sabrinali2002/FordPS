import gpt4all
gptj = gpt4all.GPT4All("ggml-gpt4all-j-v1.3-groovy")
messages = [{"role": "user", "content": "Name 3 colors"}]
gptj.chat_completion(messages)