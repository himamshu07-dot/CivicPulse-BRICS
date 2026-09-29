import math
import re
from collections import Counter
from typing import Any, Dict, List, Optional, Tuple


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two GPS coordinates in kilometers."""
    R = 6371.0088  # Earth radius in km
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c


def tokenize(text: str) -> List[str]:
    """Extracts words and character/word n-grams for semantic embedding."""
    if not text:
        return []
    words = re.findall(r"\b\w+\b", text.lower())
    unigrams = [w for w in words if len(w) > 2]
    bigrams = [f"{words[i]}_{words[i+1]}" for i in range(len(words) - 1)]
    return unigrams + bigrams


def compute_tf_idf_vectors(corpus: List[str]) -> List[Dict[str, float]]:
    """
    Computes normalized TF-IDF embedding vectors in pure Python.
    Zero compiled C-DLL dependencies for maximum portability on Windows.
    """
    tokenized_docs = [tokenize(doc) for doc in corpus]
    n_docs = len(corpus)
    df = Counter()
    for doc in tokenized_docs:
        for token in set(doc):
            df[token] += 1

    vectors = []
    for doc in tokenized_docs:
        if not doc:
            vectors.append({})
            continue
        tf = Counter(doc)
        doc_len = float(len(doc))
        vec = {}
        for token, count in tf.items():
            idf = math.log((1.0 + n_docs) / (1.0 + df[token])) + 1.0
            vec[token] = (count / doc_len) * idf

        norm = math.sqrt(sum(v * v for v in vec.values())) or 1.0
        vectors.append({k: v / norm for k, v in vec.items()})

    return vectors


def cosine_similarity_sparse(vec_a: Dict[str, float], vec_b: Dict[str, float]) -> float:
    """Computes cosine similarity between two unit-normalized sparse vectors."""
    if not vec_a or not vec_b:
        return 0.0
    common = set(vec_a.keys()) & set(vec_b.keys())
    return sum(vec_a[k] * vec_b[k] for k in common)


class SemanticDeduplicationEngine:
    """
    Embeddings & Similarity Engine for deduplicating incoming citizen signals
    and grouping them into localized topic clusters.
    """

    def __init__(self, similarity_threshold: float = 0.50):
        self.similarity_threshold = similarity_threshold

    def find_duplicate(
        self,
        new_text: str,
        new_lat: Optional[float],
        new_lon: Optional[float],
        new_category: str,
        existing_records: List[Dict[str, Any]],
        max_distance_km: float = 15.0,
    ) -> Tuple[bool, Optional[str], float]:
        """
        Scans existing records for semantic duplicates within the specified geographic radius.
        Returns:
            Tuple[is_duplicate, duplicate_parent_id, similarity_score]
        """
        if not existing_records or not new_text:
            return False, None, 0.0

        candidates = []
        for r in existing_records:
            if (
                new_lat is not None
                and new_lon is not None
                and r.get("lat") is not None
                and r.get("lon") is not None
            ):
                dist = haversine_distance_km(new_lat, new_lon, float(r["lat"]), float(r["lon"]))
                if dist > max_distance_km:
                    continue

            # Prioritize matching category or general
            if r.get("cat") == new_category or not r.get("cat"):
                candidates.append(r)

        if not candidates:
            return False, None, 0.0

        corpus = [
            f"{c.get('trans', '')} {c.get('text', '')}" for c in candidates
        ] + [new_text]

        vectors = compute_tf_idf_vectors(corpus)
        new_vec = vectors[-1]
        candidate_vecs = vectors[:-1]

        best_score = 0.0
        best_parent_id = None

        for idx, c_vec in enumerate(candidate_vecs):
            sim = cosine_similarity_sparse(new_vec, c_vec)
            if sim > best_score:
                best_score = sim
                best_parent_id = str(candidates[idx].get("id"))

        if best_score >= self.similarity_threshold and best_parent_id:
            return True, best_parent_id, round(best_score, 3)

        return False, None, round(best_score, 3)


dedup_engine = SemanticDeduplicationEngine(similarity_threshold=0.50)
