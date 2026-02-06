# backend/core/services.py

from .models import Company, Question, Answer, Category, SubCategory
from django.db.models import Q

# These constants are currently hardcoded in frontend/App.js
# They should ideally be configurable or fetched from backend if dynamic
CATEGORY_PERCENTAGES = {
  'E': 40,
  'S': 30,
  'G': 30,
}

def get_esg_level(score):
  if score < 35: return 'Ikke bestået'
  elif score < 50: return 'Bronze'
  elif score < 65: return 'Sølv'
  elif score < 80: return 'Guld'
  else: return 'Platin'

def calculate_esg_results(company_id, year):
    try:
        company = Company.objects.get(id=company_id)
    except Company.DoesNotExist:
        return {"error": "Company not found"}, 404

    # Fetch all DVA and IA questions
    dva_questions = Question.objects.filter(question_type='DVA').prefetch_related('sub_category__category')
    ia_questions = Question.objects.filter(question_type='IA').prefetch_related('sub_category__category')

    # Fetch all answers for the company and year
    answers = Answer.objects.filter(company=company, year=year).select_related('question')

    # Structure answers for easier lookup
    dva_answers_dict = {ans.question.id: ans.boolean_answer for ans in answers if ans.question.question_type == 'DVA'}
    ia_answers_dict = {ans.question.id: ans.is_answered for ans in answers if ans.question.question_type == 'IA'}

    # Replicate DVA-related calculations from App.js
    criteria_weights = {}
    impact_finansiel_counts = {}
    max_scores = {}

    # Initialize results for all possible labels from questions, not just answered ones
    all_dva_labels = sorted(list(set(q.sub_category.label for q in dva_questions)))
    for label in all_dva_labels:
        criteria_weights[label] = 0
        impact_finansiel_counts[label] = {'impact': 0, 'finansiel': 0}

    selected_dva_questions = set()
    for q_id, answer_value in dva_answers_dict.items():
        if answer_value is True: # Only 'yes' answers contribute to selection
            selected_dva_questions.add(q_id)

    for q in dva_questions:
        if q.id in selected_dva_questions:
            if q.purpose == 'impact':
                impact_finansiel_counts[q.sub_category.label]['impact'] += 1
            elif q.purpose == 'finansiel':
                impact_finansiel_counts[q.sub_category.label]['finansiel'] += 1

    # Calculate criteria_weights and impact_finansiel_counts
    for label, counts in impact_finansiel_counts.items():
        criteria_weights[label] = (counts['impact'] + counts['finansiel']) // 2

    # Calculate total weights per category (E, S, G)
    total_weight_e = sum(weight for label, weight in criteria_weights.items() if label.startswith('E'))
    total_weight_s = sum(weight for label, weight in criteria_weights.items() if label.startswith('S'))
    total_weight_g = sum(weight for label, weight in criteria_weights.items() if label.startswith('G'))

    # Calculate max_scores
    for label, weight in criteria_weights.items():
        category_code = label[0]
        total_category_weight = 0
        category_percentage = 0

        if category_code == 'E':
            total_category_weight = total_weight_e
            category_percentage = CATEGORY_PERCENTAGES['E']
        elif category_code == 'S':
            total_category_weight = total_weight_s
            category_percentage = CATEGORY_PERCENTAGES['S']
        elif category_code == 'G':
            total_category_weight = total_weight_g
            category_percentage = CATEGORY_PERCENTAGES['G']

        if total_category_weight > 0:
            max_scores[label] = (weight / total_category_weight) * category_percentage
        else:
            max_scores[label] = 0

    # Replicate IA-related calculations from App.js
    final_scores = {}
    total_score = 0
    indicator_points = {}

    all_ia_labels = sorted(list(set(q.sub_category.label for q in ia_questions)))
    for label in all_ia_labels:
        indicator_points[label] = 0

    for q in ia_questions:
        if ia_answers_dict.get(q.id) is True: # If IA question was answered 'True'
            indicator_points[q.sub_category.label] += q.points

    for label, points in indicator_points.items():
        if max_scores.get(label) is not None:
            calculated_score = (points * max_scores[label]) / 100
            final_scores[label] = calculated_score
            total_score += calculated_score
        else:
            final_scores[label] = 0 # If there's no max_score for this label, it contributes 0

    esg_level = get_esg_level(total_score)
    
    # marimekkoData and polarBarChartData are UI specific, they derive from final_scores etc.
    # We can calculate them here or let frontend do it based on these core results.
    # For now, let's just return the core calculated values.

    return {
        "company_id": company_id,
        "year": year,
        "criteriaWeights": criteria_weights,
        "impactFinansielCounts": impact_finansiel_counts,
        "maxScores": max_scores,
        "finalScores": final_scores,
        "totalScore": total_score,
        "esgLevel": esg_level,
        "indicatorPoints": indicator_points,
    }
