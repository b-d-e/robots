git clone git@github.com:b-d-e/talks.git static/talks/
sh list_pdfs.sh
zola build --force --base-url https://robots.ox.ac.uk/~be --output-dir ../WWW
chmod -R 777 ../WWW
