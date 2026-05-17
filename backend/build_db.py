import os
import shutil
import pandas as pd
import chromadb

from tqdm import tqdm
from datasets import load_dataset
from sentence_transformers import SentenceTransformer
from chromadb.config import Settings


# ==========================================
# CONFIG
# ==========================================

DATASET_SIZE = 8000

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHROMA_PATH = os.path.join(BASE_DIR, "chromadb")


# ==========================================
# LOAD DATASET
# ==========================================

print("\nLoading dataset...")

dataset = load_dataset(
    "keivalya/MedQuad-MedicalQnADataset",
    split="train"
)

dataset = dataset.select(range(DATASET_SIZE))

print("Dataset loaded:", len(dataset))


# ==========================================
# CLEAN DATA
# ==========================================



clean_rows = []

for item in dataset:

    question = str(item["Question"]).strip()
    answer = str(item["Answer"]).strip()

    clean_rows.append({
        "question": question,
        "answer": answer[:300],
        "language": "en"
    })


df = pd.DataFrame(clean_rows)

df = df.drop_duplicates(subset=["question"])

df = df.reset_index(drop=True)

print("Filtered rows:", len(df))


# ==========================================
# EMBEDDING MODEL
# ==========================================

print("\nLoading embedding model...")

embedder = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2"
)

print("Embedding model loaded")


# ==========================================
# CREATE DOCUMENTS
# ==========================================

documents = df["question"].tolist()

print("\nCreating embeddings...")

embeddings = embedder.encode(
    documents,
    show_progress_bar=True,
    normalize_embeddings=True
)

print("Embeddings created:", len(embeddings))


# ==========================================
# RESET CHROMADB
# ==========================================

if os.path.exists(CHROMA_PATH):
    shutil.rmtree(CHROMA_PATH)

os.makedirs(CHROMA_PATH, exist_ok=True)

print("\nCreating ChromaDB...")

client = chromadb.PersistentClient(
    path=CHROMA_PATH,
    settings=Settings(allow_reset=True)
)

client.reset()

collection = client.get_or_create_collection(
    name="medical_qa"
)


# ==========================================
# PREPARE METADATA
# ==========================================

metadatas = []

for _, row in df.iterrows():

    metadatas.append({
        "answer": row["answer"],
        "language": row["language"]
    })


ids = [str(i) for i in range(len(df))]


# ==========================================
# STORE DATA
# ==========================================

BATCH_SIZE = 5000

for i in range(0, len(documents), BATCH_SIZE):

    collection.add(
        documents=documents[i:i+BATCH_SIZE],
        embeddings=embeddings[i:i+BATCH_SIZE].tolist(),
        metadatas=metadatas[i:i+BATCH_SIZE],
        ids=ids[i:i+BATCH_SIZE]
    )

    print(f"Added batch {i} to {i+BATCH_SIZE}")

print("\nChromaDB created successfully")


# ==========================================
# TEST RETRIEVAL
# ==========================================

print("\nTesting retrieval...\n")

test_questions = [
    "What are malaria symptoms?",
    "What causes dengue?",
    "What is dehydration?",
    "What should I do during fever?"
]

for query in test_questions:

    print("=" * 60)
    print("QUERY:", query)

    query_embedding = embedder.encode(
        [query],
        normalize_embeddings=True
    )

    results = collection.query(
        query_embeddings=query_embedding.tolist(),
        n_results=25
    )

    print("\nMATCHED QUESTION:")
    print(results["documents"][0][0])

    print("\nANSWER:")
    print(results["metadatas"][0][0]["answer"][:300])

    print("\nDISTANCE:")
    print(results["distances"][0][0])

    print("\n")


print("=" * 60)
print("DONE")
print("=" * 60)