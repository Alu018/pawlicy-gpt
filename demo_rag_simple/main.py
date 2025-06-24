import ollama

# define embedding and language models
EMBEDDING_MODEL = 'hf.co/CompendiumLabs/bge-base-en-v1.5-gguf'
LANGUAGE_MODEL = 'hf.co/bartowski/Llama-3.2-1B-Instruct-GGUF'

dataset = []    # array of strings, each string is a chunk of text
VECTOR_DB = []  # Each element in the VECTOR_DB will be a tuple (chunk, embedding)

with open('cat-facts.txt', 'r') as file:
    dataset = file.readlines()
    print(f'Loaded {len(dataset)} entries')

# convert a chunk of text into an embedding and add it to the vector database
def add_chunk_to_database(chunk):
    embedding = ollama.embed(model=EMBEDDING_MODEL, input=chunk)['embeddings'][0]
    VECTOR_DB.append((chunk, embedding))

# running through the dataset and adding each chunk to the vector database
for i, chunk in enumerate(dataset):
    add_chunk_to_database(chunk)
    print(f'Added chunk {i+1}/{len(dataset)} to the database')
    
# implement the retrieval system
# retrieval function: takes a query and returns the top N most relevant chunks based on cosine similarity. We can imagine that the higher the cosine similarity between the two vectors, the "closer" they are in the vector space. This means they are more similar in terms of meaning.

def cosine_similarity(a, b):
    dot_product = sum([x * y for x, y in zip(a, b)])    # zip pairs elements of a and b together in parallel
    norm_a = sum([x ** 2 for x in a]) ** 0.5
    norm_b = sum([x ** 2 for x in b]) ** 0.5
    return dot_product / (norm_a * norm_b)

def retrieve(query, top_n=3):
  query_embedding = ollama.embed(model=EMBEDDING_MODEL, input=query)['embeddings'][0]
  # temporary list to store (chunk, similarity) pairs
  similarities = []
  for chunk, embedding in VECTOR_DB:
    # comparing the query embedding with each embedding from the vector database  
    similarity = cosine_similarity(query_embedding, embedding)
    similarities.append((chunk, similarity))
    
  # sort by similarity in descending order, because higher similarity means more relevant chunks. Sort the list based on the similarity score (x[1] of each tuple)
  similarities.sort(key=lambda x: x[1], reverse=True)
  # finally, return the top N most relevant chunks
  return similarities[:top_n]

# Generation: chatbot will generate a response based on the retrieved knowledge from the step above. This is done by simply adding the chunks into the prompt that will be taken as input for the chatbot

input_query = input('Ask me a question: ')
retrieved_knowledge = retrieve(input_query)

print('Retrieved knowledge:')
for chunk, similarity in retrieved_knowledge:
  print(f' - (similarity: {similarity:.2f}) {chunk}')

instruction_prompt = f'''You are a helpful chatbot.
Use only the following pieces of context to answer the question. Don't make up any new information:
{'\n'.join([f' - {chunk}' for chunk, similarity in retrieved_knowledge])}
'''

# use the ollama to generate the response. use instruction_prompt as system message:
stream = ollama.chat(
  model=LANGUAGE_MODEL,
  messages=[
    {'role': 'system', 'content': instruction_prompt},
    {'role': 'user', 'content': input_query},
  ],
  stream=True,
)

# print the response from the chatbot in real-time
print('Chatbot response:')
for chunk in stream:
  print(chunk['message']['content'], end='', flush=True)
