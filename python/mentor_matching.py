


from flask import Flask, request, jsonify
import pandas as pd
import numpy as np 
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

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