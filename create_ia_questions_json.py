import csv
import json
import re

csv_file_path = 'src/data/IA-subsubcategories.csv'
json_file_path = 'ia_questions_data.json'

questions_data = []
current_category_code = None
current_subcategory_label = None
current_subcategory_title = None
current_second_subcategory_number = None
current_second_subcategory_title = None
question_id_counter = 1000 # Starting ID for generated questions

def generate_unique_id():
    global question_id_counter
    question_id_counter += 1
    return question_id_counter

with open(csv_file_path, 'r', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile, delimiter='	') # Tab-separated based on content

    for row in reader:
        # Filter out empty strings from the row
        row = [cell.strip() for cell in row if cell.strip()]

        if not row:
            continue

        # Detect top-level category (e.g., E1, S1, G1)
        # Example: E1	Klimaforandringer
        if re.match(r'^[ESG]\d+$', row[0]):
            current_category_code = row[0][0] # E, S, G
            current_subcategory_label = row[0] # E1, S1, G1
            current_subcategory_title = row[1] if len(row) > 1 else ""
            current_second_subcategory_number = None
            current_second_subcategory_title = None

        # Detect second-level subcategory (e.g., 1.1, 1.2)
        # Example: 1.1	CO2 udledninger
        elif re.match(r'^\d+\.\d+$', row[0]):
            current_second_subcategory_number = row[0] # 1.1, 1.2 etc.
            current_second_subcategory_title = row[1] if len(row) > 1 else ""

        # Detect actual question (e.g., 1.1.1	Virksomheden har udregnet...)
        elif re.match(r'^\d+\.\d+\.\d+$', row[0]):
            number = row[0] # e.g., 1.1.1
            text = row[1] # The question text
            points = None
            if len(row) > 2 and row[2].replace(',', '.').replace(' ', '').replace('%', '').strip().isdigit():
                points = int(float(row[2].replace(',', '.'))) # points column, assuming it's the 3rd non-empty cell

            if current_category_code and current_subcategory_label and current_subcategory_title and current_second_subcategory_title:
                questions_data.append({
                    "id": generate_unique_id(), # Generate unique ID
                    "label": current_subcategory_label, # E1, S1, G1
                    "text": text,
                    "category": current_category_code, # E, S, G
                    "subcategory": current_subcategory_title, # Klimaforandringer
                    "secondSubcategory": f"{current_second_subcategory_number} {current_second_subcategory_title}", # 1.1 CO2 udledninger
                    "points": points,
                    "number": number # 1.1.1
                })
            else:
                print(f"Skipping question due to missing category info: {row}")

# Save the data to a JSON file
with open(json_file_path, 'w', encoding='utf-8') as jsonfile:
    json.dump(questions_data, jsonfile, ensure_ascii=False, indent=4)

print(f"Successfully converted {csv_file_path} to {json_file_path}")
