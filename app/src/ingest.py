from dotenv import load_dotenv
load_dotenv()

from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

from langchain_pinecone import PineconeEmbeddings, PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec
import os

pdfTest = "rag_sources/carriage_horse_heat_2019.pdf"

model_name = 'multilingual-e5-large'
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
cloud = os.environ.get('PINECONE_CLOUD') or 'aws'
region = os.environ.get('PINECONE_REGION') or 'us-east-1'
spec = ServerlessSpec(cloud=cloud, region=region)

index_name = "policy-docs"
namespace = "horse_carriage"

def ingest_document(file_path, index_name, namespace):
    # 1. Load PDF or markdown
    loader = PyPDFLoader(file_path)
    docs = loader.load()

    # 2. Split into chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = splitter.split_documents(docs)

    # 3. Embeddings
    embeddings = PineconeEmbeddings(
        model=model_name,
        pinecone_api_key=os.environ.get('PINECONE_API_KEY')
    )
    
    # 4. Initialize Pinecone index if not exists
    if index_name not in pc.list_indexes().names():
        pc.create_index(
            name=index_name,
            dimension=embeddings.dimension,
            metric="cosine",
            spec=spec
        )

    # 5. Embed chunked documents and upsert to Pinecone
        # upserts new vectors into the namespace based on above parameters
        # if the namespace does not exist, it will be created automatically.
    PineconeVectorStore.from_documents(
        chunks,
        index_name=index_name,
        embedding=embeddings,
        namespace=namespace
        )

if __name__ == "__main__":
    ingest_document(pdfTest, index_name, namespace)

# get reference to the index so you can check its status, manually delete vectors, etc.
# index = pc.Index(index_name)