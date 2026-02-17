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
    # Ensure 'topic' is selected for IA questions
    dva_questions = Question.objects.filter(question_type='DVA').prefetch_related('sub_category__category')
    ia_questions = Question.objects.filter(question_type='IA').select_related('sub_category__category') # Use select_related for direct foreign key


    # Fetch all answers for the company and year
    answers = Answer.objects.filter(company=company, year=year).select_related('question')

    # Structure answers for easier lookup
    dva_answers_dict = {ans.question.id: ans.boolean_answer for ans in answers if ans.question.question_type == 'DVA'}
    ia_answers_dict = {ans.question.id: {'is_answered': ans.is_answered, 'metric_value': ans.metric_value} for ans in answers if ans.question.question_type == 'IA'}


    # DVA-related calculations (existing logic, mostly unchanged)
    criteria_weights = {}
    impact_finansiel_counts = {}
    
    all_dva_sub_category_labels = sorted(list(set(q.sub_category.label for q in dva_questions)))
    for label in all_dva_sub_category_labels:
        criteria_weights[label] = 0 # Initialize with 0
        impact_finansiel_counts[label] = {'impact': 0, 'finansiel': 0}

    selected_dva_questions = set()
    for q_id, answer_value in dva_answers_dict.items():
        if answer_value is True:
            selected_dva_questions.add(q_id)

    for q in dva_questions:
        if q.id in selected_dva_questions:
            if q.purpose == 'impact':
                impact_finansiel_counts[q.sub_category.label]['impact'] += 1
            elif q.purpose == 'finansiel':
                impact_finansiel_counts[q.sub_category.label]['finansiel'] += 1

    for label, counts in impact_finansiel_counts.items():
        criteria_weights[label] = (counts['impact'] + counts['finansiel']) // 2


    # Calculate total weights per main category (E, S, G)
    total_weight_e = sum(weight for label, weight in criteria_weights.items() if label.startswith('E'))
    total_weight_s = sum(weight for label, weight in criteria_weights.items() if label.startswith('S'))
    total_weight_g = sum(weight for label, weight in criteria_weights.items() if label.startswith('G'))

    # Calculate max_scores for each sub-category label (E1, S1, etc.)
    max_scores = {}
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
            # max_scores represents the maximum possible score a sub-category can contribute to the total 100% ESG score
            max_scores[label] = (weight / total_category_weight) * category_percentage
        else:
            max_scores[label] = 0
    
    # IA-related calculations for Marimekko Chart
    indicator_points_by_topic = {} # Points earned per sub-subcategory (topic)
    max_points_by_topic = {}      # Max possible points per sub-subcategory (topic)

    # Initialize topic-based points and max points
    all_ia_topics = sorted(list(set(q.topic for q in ia_questions if q.topic)))
    for topic in all_ia_topics:
        indicator_points_by_topic[topic] = 0
        max_points_by_topic[topic] = 0

    for q in ia_questions:
        if q.topic: # Ensure question has a topic
            max_points_by_topic[q.topic] += (q.points if q.points is not None else 0)
            if ia_answers_dict.get(q.id) and ia_answers_dict[q.id]['is_answered'] is True:
                indicator_points_by_topic[q.topic] += (q.points if q.points is not None else 0)
    
    marimekkoData = []
    for topic in all_ia_topics:
        marimekkoData.append({
            "subcategory": topic,
            "maxPoints": max_points_by_topic.get(topic, 0),
            "earnedPoints": indicator_points_by_topic.get(topic, 0)
        })
    
    # Calculation of final scores and total score for Polar Chart
    # Aggregate indicator points from topic level back to sub_category label (E1, S1, etc.)
    # The existing indicator_points (keyed by sub_category.label) in the original code logic was effectively doing this
    # Let's ensure the indicator_points structure correctly sums up points per E1, S1, G1...
    indicator_points_by_sub_category = {label: 0 for label in all_dva_sub_category_labels} # Use DVA labels for all sub_categories

    for q in ia_questions:
        if q.sub_category and q.sub_category.label: # Ensure sub_category and its label exist
            if ia_answers_dict.get(q.id) and ia_answers_dict[q.id]['is_answered'] is True:
                indicator_points_by_sub_category[q.sub_category.label] += (q.points if q.points is not None else 0)

    final_scores = {}
    total_score = 0
    polarBarChartData = []

    for label in all_dva_sub_category_labels: # Iterate over the main sub-category labels (E1, S1, G1)
        # The 'max_scores[label]' is the maximum contribution this sub_category can give to the total 100% ESG score
        # The 'indicator_points_by_sub_category[label]' are the actual raw points earned for this sub_category
        
        # We need the maximum possible IA points for this sub-category (e.g., max points for E1 questions)
        # to normalize the earned indicator_points_by_sub_category[label]
        max_possible_ia_points_for_sub_category = sum(
            q.points for q in ia_questions 
            if q.sub_category and q.sub_category.label == label and q.points is not None
        )

        calculated_final_score_for_label = 0
        if max_possible_ia_points_for_sub_category > 0:
            # Proportion of earned points vs max possible IA points for the sub-category
            proportion_earned = indicator_points_by_sub_category.get(label, 0) / max_possible_ia_points_for_sub_category
            calculated_final_score_for_label = proportion_earned * max_scores.get(label, 0)
        
        final_scores[label] = calculated_final_score_for_label
        total_score += calculated_final_score_for_label
        
        # polarBarChartData expects "Point (Optjent)" to be the final score, normalized to max 100
        # The CustomPolarChart has its own internal maxPossiblePoints = 100, which suggests the "Point (Optjent)"
        # should be the final percentage contribution of this sub_category relative to its max_score (which is already a percentage of the total 100%)
        # So, if final_scores[label] is already a portion of 100, we can use it.
        
        # The polar chart expects a value from 0-100, where 100 is the outer radius.
        # final_scores[label] is already a scaled score representing its contribution to the total 100%.
        # We need to express this 'final_scores[label]' *as a percentage of its own max possible contribution ('max_scores[label]')*
        # so that it correctly fills the segment in the polar chart from 0 to 100% of its potential.

        percentage_of_max_contribution = 0
        if max_scores.get(label, 0) > 0:
            percentage_of_max_contribution = (final_scores[label] / max_scores[label]) * 100
        else: # max_scores[label] is 0, implies no DVA contribution for this sub_category
            if max_possible_ia_points_for_sub_category > 0:
                # If there are IA questions, calculate contribution based on IA completion
                percentage_of_max_contribution = (indicator_points_by_sub_category.get(label, 0) / max_possible_ia_points_for_sub_category) * 100
            # If max_possible_ia_points_for_sub_category is also 0, then percentage_of_max_contribution remains 0.

        polarBarChartData.append({
            "criterion": label,
            "Point (Optjent)": percentage_of_max_contribution
        })

    esg_level = get_esg_level(total_score)
    
    return {
        "company_id": company_id,
        "year": year,
        "criteriaWeights": criteria_weights,
        "impactFinansielCounts": impact_finansiel_counts,
        "maxScores": max_scores, # Max contribution to total ESG score (0-100) per sub_category
        "finalScores": final_scores, # Actual contribution to total ESG score (0-100) per sub_category
        "totalScore": total_score, # Total ESG score (0-100)
        "esgLevel": esg_level,
        "indicatorPoints": indicator_points_by_sub_category, # Raw IA points per sub_category
        "marimekkoData": marimekkoData, # Data for Marimekko chart (topic level)
        "polarBarChartData": polarBarChartData, # Data for Polar chart (sub_category label level)
    }, 200