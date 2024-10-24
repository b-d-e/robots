#!/bin/bash

# Define the directory with PDFs
TALKS_DIR="static/talks"
OUTPUT_FILE="content/talks_pdfs.json"

# Start the JSON array
echo "[" > $OUTPUT_FILE

# Loop through each PDF and add it to the JSON file
for pdf in $TALKS_DIR/*.pdf; do
    filename=$(basename -- "$pdf")
    title="${filename%.*}" # Remove extension for the title
    date=$(git log --follow --format=%aI -- "$pdf" | tail -1 | cut -d'T' -f1)
    echo "  { \"file\": \"$filename\", \"title\": \"$title\", \"date\": \"$date\" }," >> $OUTPUT_FILE
done

# Remove the trailing comma from the last entry and close the array
sed -i '' '$ s/,$//' $OUTPUT_FILE
echo "]" >> $OUTPUT_FILE

