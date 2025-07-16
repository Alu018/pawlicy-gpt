from dotenv import load_dotenv
load_dotenv()

import os
import time

from pinecone import Pinecone
from langchain_pinecone import PineconeEmbeddings, PineconeVectorStore
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain import hub

# gemini import llm
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain import hub

from langchain.prompts import PromptTemplate

# You are an expert assistant. Use the provided context to answer the question. 
# If the context is not helpful or does not contain the answer, answer from your own knowledge. Regardless of whether the context is helpful, do NOT mention the context in your answer.

custom_prompt = PromptTemplate(
    input_variables=["context", "input"],
    template="""
        You are an expert assistant.

        First, provide a detailed answer to the question based on your general knowledge.

        Then if applicable, supplement your answer with the following relevant facts from these documents:
        {context}
        
        However, if the query is clearly not related to or present in the documents, answer solely based on your own knowledge.
        
        Regardless, in your response to the user, do not mention that you are using these documents. Instead, seamlessly integrate the information into your answer. If possible, format your response in a way that is easy to read, such as using headers, bullet points or numbered lists.

        If there is any conflict between your knowledge and the documents, prioritize the documents.

        Question:
        {input}
        
        Answer:
        """
    )

index_name = "policy-docs"
namespace = "horse_carriage"
model_name = 'multilingual-e5-large'

pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))

embeddings = PineconeEmbeddings(
    model=model_name,
    pinecone_api_key=os.environ.get('PINECONE_API_KEY')
)

# connect to an existing pinecone index
docsearch = PineconeVectorStore(
    index_name=index_name,
    embedding=embeddings,
    namespace=namespace
)

# index = pc.Index(index_name)

# Load prompt from LangChain hub
retrieval_qa_chat_prompt = hub.pull("langchain-ai/retrieval-qa-chat")

# Create retriever (you still need to define `docsearch`)
retriever = docsearch.as_retriever()

# Gemini setup
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    google_api_key=os.environ.get("GEMINI_API_KEY"),
    temperature=0.0
)

# Build chain
combine_docs_chain = create_stuff_documents_chain(
    llm, custom_prompt
)

# retriever = docsearch.as_retriever(search_kwargs={"score_threshold": 0.7})
retrieval_chain = create_retrieval_chain(retriever, combine_docs_chain)

# # example queries
query1 = "What are the first 3 steps for getting started with the WonderVector5000?"
query2 = "The Neural Fandango Synchronizer is giving me a headache. What do I do?"
query3 = "Tell me about mockingbirds"

# answer1_without_knowledge = llm.invoke(query1)

# print("Query 1:", query1)
# print("\nAnswer without knowledge:\n\n", answer1_without_knowledge.content)
# print("\n")
# time.sleep(2)

# answer1_with_knowledge = retrieval_chain.invoke({"input": query1})

# print("Answer with knowledge:\n\n", answer1_with_knowledge['answer'])
# print("\nContext used:\n\n", answer1_with_knowledge['context'])
# print("\n")
# time.sleep(2)

# answer2_without_knowledge = llm.invoke(query3)

# print("Query 2:", query3)
# print("\nAnswer without knowledge:\n\n", answer2_without_knowledge.content)
# print("\n")
# time.sleep(2)

answer2_with_knowledge = retrieval_chain.invoke({"input": query3})

print("\nAnswer with knowledge:\n\n", answer2_with_knowledge['answer'])
print("\nContext Used:\n\n", answer2_with_knowledge['context'])
print("\n")
time.sleep(2)

# See how many vectors have been upserted
# print("Index after upsert:")
# print(pc.Index(index_name).describe_index_stats())
# print("\n")
# time.sleep(2)

# for ids in index.list(namespace=namespace):
#     query = index.query(
#         id=ids[0], 
#         namespace=namespace, 
#         top_k=1,
#         include_values=False,
#         include_metadata=True
#     )
#     print(query)
#     print("\n")

# delete all vectors in the namespace
# index.delete(delete_all=True, namespace="wondervector5000")

# show the index stats
# print(index.describe_index_stats())
