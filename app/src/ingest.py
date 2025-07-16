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
    print(f"Loading file: {file_path}")
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    print(f"Loaded {len(docs)} pages from PDF.")

    # 2. Split into chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = splitter.split_documents(docs)
    print(f"Split into {len(chunks)} chunks for embedding.")

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
        print(f"Created new index: {index_name}")
    else:
        print(f"Using existing index: {index_name}")

    # 5. Embed chunked documents and upsert to Pinecone
        # upserts new vectors into the namespace based on above parameters
        # if the namespace does not exist, it will be created automatically.
    PineconeVectorStore.from_documents(
        chunks,
        index_name=index_name,
        embedding=embeddings,
        namespace=namespace
    )
    
    print(f"Upserted {len(chunks)} chunks into index '{index_name}' under namespace '{namespace}'.")
    
    stats = pc.Index(index_name).describe_index_stats()
    print(f"Index stats after upsert: {stats}")

if __name__ == "__main__":
    ingest_document(pdfTest, index_name, namespace)