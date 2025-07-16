import os
from dotenv import load_dotenv
load_dotenv()

from langchain_community.document_loaders import PyPDFLoader
from langchain.document_loaders import WebBaseLoader  # For scraping webpages
from langchain.text_splitter import RecursiveCharacterTextSplitter

from langchain_pinecone import PineconeEmbeddings, PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec

# Initialize Pinecone client and config
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
cloud = os.environ.get('PINECONE_CLOUD') or 'aws'
region = os.environ.get('PINECONE_REGION') or 'us-east-1'
spec = ServerlessSpec(cloud=cloud, region=region)

index_name = "policy-docs"
model_name = 'multilingual-e5-large'

embeddings = PineconeEmbeddings(
    model=model_name,
    pinecone_api_key=os.environ.get('PINECONE_API_KEY')
)

# Make sure the Pinecone index exists (create if missing)
if index_name not in pc.list_indexes().names():
    print(f"Creating Pinecone index: {index_name}")
    pc.create_index(
        name=index_name,
        dimension=embeddings.dimension,
        metric="cosine",
        spec=spec
    )
else:
    print(f"Using existing Pinecone index: {index_name}")

# Splitter config - same for all sources
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

def ingest_pdf(file_path, namespace):
    print(f"Ingesting PDF: {file_path} into namespace: {namespace}")
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    chunks = splitter.split_documents(docs)

    PineconeVectorStore.from_documents(
        chunks,
        index_name=index_name,
        embedding=embeddings,
        namespace=namespace
    )
    print(f"Done ingesting PDF: {file_path} - {len(chunks)} chunks added.")

def ingest_url(url, namespace):
    print(f"Ingesting URL: {url} into namespace: {namespace}")
    loader = WebBaseLoader(url)
    docs = loader.load()
    chunks = splitter.split_documents(docs)

    PineconeVectorStore.from_documents(
        chunks,
        index_name=index_name,
        embedding=embeddings,
        namespace=namespace
    )
    print(f"Done ingesting URL: {url} - {len(chunks)} chunks added.")

def batch_ingest(data_sources):
    """
    data_sources: list of dicts with keys:
        - type: 'pdf' or 'url'
        - source: file path or url string
        - namespace: namespace string for Pinecone
    """
    for entry in data_sources:
        src_type = entry['type'].lower()
        source = entry['source']
        namespace = entry['namespace']

        try:
            if src_type == 'pdf':
                ingest_pdf(source, namespace)
            elif src_type == 'url':
                ingest_url(source, namespace)
            else:
                print(f"Skipping unknown source type: {src_type} for {source}")
        except Exception as e:
            print(f"Error ingesting {source}: {e}")

if __name__ == "__main__":
    data_sources = [
        {"type": "pdf", "source": "rag_sources/carriage_horse_heat_2019.pdf", "namespace": "horse_carriage"},
        {"type": "pdf", "source": "rag_sources/bird_safety_report.pdf", "namespace": "bird_safety"},
        {"type": "url", "source": "https://abcbirds.org/blog/bird-friendly-design-coming-soon/", "namespace": "bird_safety"},
        # add more data sources here...
    ]

    batch_ingest(data_sources)
