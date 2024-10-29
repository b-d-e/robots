#!/bin/sh

# Define the directory with PDFs
TALKS_DIR="static/talks"
OUTPUT_FILE="content/talks_pdfs.json"

# Start the JSON array
echo "[" > "$OUTPUT_FILE"

replace_underscores_and_dashes() {
    echo "$1" | sed 's/[_-]/ /g'
}

capitalize_first_letter() {
    echo "$1" | awk '{ for(i=1; i<=NF; i++) { $i = toupper(substr($i, 1, 1)) substr($i, 2) } }1'
}

# Change directory to TALKS_DIR to get the correct Git context
cd "$TALKS_DIR" || exit 1

# Declare an array to hold the entries
entries=()

# Loop through each PDF and add it to the array
for pdf in ./*.pdf; do
    if [ ! -f "$pdf" ]; then
        continue
    fi

    filename=$(basename -- "$pdf")
    title=$(capitalize_first_letter "$(replace_underscores_and_dashes "${filename%.*}")") # Remove extension and prettify title

    # Get the creation date of the file in the submodule repo
    date=$(git log --diff-filter=A --format=%aI -- "$pdf" | tail -1 | cut -d'T' -f1)

    # Only add to the entries if a date is found
    if [ -n "$date" ]; then
        entries+=("{ \"file\": \"$filename\", \"title\": \"$title\", \"date\": \"$date\" }")
    fi
done

# Sort entries by date in reverse order
sorted_entries=$(printf "%s\n" "${entries[@]}" | sort -t'"' -k6,6r)

# Write sorted entries to the output file
for entry in $sorted_entries; do
    echo "  $entry," >> "../$OUTPUT_FILE"
done

# Go back to the original directory
cd - || exit 1

# Remove the trailing comma from the last entry and close the array
if [ "$OSTYPE" = "darwin"* ]; then
    # macOS-specific sed syntax
    sed -i '' '$ s/,$//' "$OUTPUT_FILE"
else
    # Linux-compatible sed syntax
    sed -i '$ s/,$//' "$OUTPUT_FILE"
fi

echo "]" >> "$OUTPUT_FILE"
