install:
	yarn install

start:
	docker-compose up --build --force-recreate

stop:
	docker-compose stop

lint:
	yarn lint

clean:
	docker-compose kill && docker system prune --force --volumes

typecheck:
	yarn --cwd server typecheck && yarn --cwd server test && yarn --cwd ui typecheck
ci: install lint typecheck
