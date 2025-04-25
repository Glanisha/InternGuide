from flask import Flask, request, jsonify
import pandas as pd
import numpy as np 
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

def assign_best_matches(source_list, target_list, source_keys, target_keys):
    source_profiles = [" ".join(item[k] for k in source_keys if k in item) for item in source_list]
    target_profiles = [" ".join(item[k] for k in target_keys if k in item) for item in target_list]

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(source_profiles + target_profiles)

    source_vectors = tfidf_matrix[:len(source_list)]
    target_vectors = tfidf_matrix[len(source_list):]

    similarity_matrix = cosine_similarity(source_vectors, target_vectors)

    assignments = {}
    for i, source in enumerate(source_list):
        best_match_index = np.argmax(similarity_matrix[i])
        assignments[source["_id"]] = target_list[best_match_index]["_id"]
    
    return assignments

@app.route('/assign-internships', methods=['POST'])
def assign_internships():
    try:
        data = request.get_json()
        students = data.get("students", [])
        internships = data.get("internships", [])

        if not students or not internships:
            return jsonify({"error": "Missing students or internships data"}), 400

        result = assign_best_matches(
            students, internships,
            source_keys=["skills", "interests"],
            target_keys=["requiredSkills", "domain"]
        )
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/assign-mentors', methods=['POST'])
def assign_mentors():
    try:
        data = request.get_json()
        students = data.get("students", [])
        faculty = data.get("faculty", [])

        if not students or not faculty:
            return jsonify({"error": "Missing students or faculty data"}), 400

        student_profiles = [" ".join(s["skills"] + s["interests"]) for s in students]
        faculty_profiles = [" ".join(f["areasOfExpertise"] + f["researchInterests"]) for f in faculty]

        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(student_profiles + faculty_profiles)

        student_vectors = tfidf_matrix[:len(students)]
        faculty_vectors = tfidf_matrix[len(students):]

        similarity_matrix = cosine_similarity(student_vectors, faculty_vectors)

        assigned_mentors = {}
        for i, student in enumerate(students):
            best_match_index = np.argmax(similarity_matrix[i])
            assigned_mentors[student["_id"]] = faculty[best_match_index]["_id"]

        return jsonify(assigned_mentors)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)