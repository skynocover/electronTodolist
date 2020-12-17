NAME=todolist

generate:
	wrangler generate $(NAME) --type=webpack

dev:
	wrangler dev 

publish:
	wrangler publish

login:
	wrangler login