#!/bin/bash

# Define the directory with PDFs
TALKS_DIR="static/talks"
OUTPUT_FILE="content/talks_pdfs.json"

# Start the JSON array
echo "[" > $OUTPUT_FILE

replace_underscores_and_dashes() {
    echo "$1" | sed 's/[_-]/ /g'
}

capitalize_first_letter() {
    echo "$1" | awk '{ for(i=1; i<=NF; i++) { $i = toupper(substr($i, 1, 1)) substr($i, 2) } }1'
}

# Loop through each PDF and add it to the JSON file
for pdf in $TALKS_DIR/*.pdf; do
    filename=$(basename -- "$pdf")
    title=$(capitalize_first_letter "$(replace_underscores_and_dashes "${filename%.*}")") # Remove extension and prettify title
    date=$(git log --follow --format=%aI -- "$pdf" | tail -1 | cut -d'T' -f1)
    echo "  { \"file\": \"$filename\", \"title\": \"$title\", \"date\": \"$date\" }," >> $OUTPUT_FILE
done

# Remove the trailing comma from the last entry and close the array
sed -i '' '$ s/,$//' $OUTPUT_FILE
echo "]" >> $OUTPUT_FILE
