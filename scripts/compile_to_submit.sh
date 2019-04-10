pandoc -t latex <../documentation/markdown/sources.md >../documentation/generated/to_submit/pdf/sources.tex --template=../documentation/templates/sources_template.tex
pandoc -t latex <../documentation/markdown/title.md >../documentation/generated/to_submit/pdf/title.tex --template=../documentation/templates/title_template.tex
pandoc -t latex <../documentation/markdown/user_documentation.md >../documentation/generated/to_submit/pdf/to_submit.tex --template=../documentation/templates/to_submit_template.tex
