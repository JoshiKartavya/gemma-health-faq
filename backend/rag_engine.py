import chromadb
from sentence_transformers import SentenceTransformer
import os

# ==========================================
# LOAD EMBEDDING MODEL
# ==========================================

embedder = SentenceTransformer(
    "sentence-transformers/multi-qa-MiniLM-L6-cos-v1"
)

# ==========================================
# CONNECT CHROMADB
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

CHROMA_PATH = os.path.join(BASE_DIR, "chromadb")

client = chromadb.PersistentClient(path=CHROMA_PATH)

collection = client.get_collection("medical_qa")

# ==========================================
# QUERY NORMALIZATION
# ==========================================

def normalize_query(question):

    q = question.lower()

    # symptoms
    if "symptom" in q:
        diseases = [
            "malaria",
            "dengue",
            "cholera",
            "pneumonia",
            "typhoid",
            "fever"
        ]

        for disease in diseases:
            if disease in q:
                return f"What are the symptoms of {disease}?"

    # causes
    if "cause" in q:
        diseases = [
            "dengue",
            "malaria",
            "cholera",
            "pneumonia"
        ]

        for disease in diseases:
            if disease in q:
                return f"What causes {disease}?"

    # prevention
    if "prevent" in q:
        diseases = [
            "dengue",
            "malaria",
            "cholera",
            "fever"
        ]

        for disease in diseases:
            if disease in q:
                return f"How to prevent {disease}?"

    # treatment
    treatment_words = [
        "treatment",
        "cure",
        "drink",
        "medicine",
        "help"
    ]

    if any(word in q for word in treatment_words):

        diseases = [
            "dehydration",
            "cholera",
            "fever",
            "malaria",
            "dengue"
        ]

        for disease in diseases:
            if disease in q:
                return f"What are treatments for {disease}?"

    return question

# ==========================================
# MAIN RETRIEVAL FUNCTION
# ==========================================

def retrieve(question, language="en", n_results=150):

    # normalize question
    question = normalize_query(question)

    query_lower = question.lower()

    # create embedding
    query_embedding = embedder.encode(
        [question],
        normalize_embeddings=True
    )

    # medical keywords
    medical_keywords = [
        "malaria",
        "dengue",
        "typhoid",
        "dehydration",
        "fever",
        "pregnancy",
        "diarrhea",
        "cholera",
        "heatstroke",
        "cough",
        "flu",
        "pneumonia",
        "vomiting",
        "headache",
        "infection",
        "virus",
        "symptoms",
        "treatment",
        "causes",
        "prevention"
    ]

    matched_keyword = None

    for keyword in medical_keywords:
        if keyword in query_lower:
            matched_keyword = keyword
            break

    # query chromadb
    results = collection.query(
        query_embeddings=query_embedding.tolist(),
        n_results=n_results,
        where={"language": language}
    )

    retrieved_docs = results["documents"][0]
    retrieved_meta = results["metadatas"][0]
    retrieved_distances = results["distances"][0]

    # GUARANTEE RECALL FOR DISEASE
    if matched_keyword:
        kw_embedding = embedder.encode(
            [matched_keyword],
            normalize_embeddings=True
        )
        kw_results = collection.query(
            query_embeddings=kw_embedding.tolist(),
            n_results=15,
            where={"language": language}
        )
        
        for i in range(len(kw_results["documents"][0])):
            doc = kw_results["documents"][0][i]
            if doc not in retrieved_docs:
                retrieved_docs.append(doc)
                retrieved_meta.append(kw_results["metadatas"][0][i])
                retrieved_distances.append(kw_results["distances"][0][i])

    # ==========================================
    # DEBUG LOGGING
    # ==========================================

    print("\n==============================")
    print("USER QUESTION:")
    print(question)

    print("\nTOP MATCHES:")

    for i in range(len(retrieved_docs)):

        print(f"\nMatch {i+1}")

        print("Question:")
        print(retrieved_docs[i])

        print("\nDistance:")
        print(retrieved_distances[i])

    print("==============================\n")

    # ==========================================
    # CUSTOM RANKING
    # ==========================================

    best_index = 0
    best_score = -999

    query_words = query_lower.split()

    disease_words = [
        "malaria",
        "dengue",
        "typhoid",
        "cholera",
        "pneumonia",
        "dehydration",
        "gastroenteritis",
        "fever"
    ]

    for i, doc in enumerate(retrieved_docs):

        doc_lower = doc.lower()

        # semantic score
        semantic_score = 1 - retrieved_distances[i]

        # keyword overlap
        keyword_matches = sum(
            1 for word in query_words
            if word in doc_lower
        )

        final_score = semantic_score + (keyword_matches * 0.3)

        # exact keyword boost
        if matched_keyword:

            if matched_keyword in doc_lower:
                final_score += 5

            # disease-specific aggressive boost
            for disease in disease_words:

                if disease in query_lower and disease in doc_lower:
                    final_score += 8

        # treatment boost
        if "treatment" in query_lower and "treatment" in doc_lower:
            final_score += 4

        # symptoms boost
        if "symptoms" in query_lower and "symptoms" in doc_lower:
            final_score += 4

        # causes boost
        if "causes" in query_lower and "causes" in doc_lower:
            final_score += 4

        # prevention boost
        if "prevention" in query_lower and "prevent" in doc_lower:
            final_score += 4

        # pick best
        if final_score > best_score:
            best_score = final_score
            best_index = i

    # ==========================================
    # RETURN BEST MATCH
    # ==========================================

    return {
        "question": question,
        "retrieved_question": retrieved_docs[best_index],
        "answer": retrieved_meta[best_index]["answer"],
        "language": retrieved_meta[best_index]["language"]
    }