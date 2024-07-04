install:
	yarn install

start:
	REVERSE_PROXY_DIR=dev docker-compose up --build --force-recreate

maintenance:
	REVERSE_PROXY_DIR=maintenance docker-compose up --build --force-recreate

stop:
	docker-compose stop

lint:
	yarn lint

clean:
	docker-compose kill && docker system prune --force --volumes

typecheck:
	yarn --cwd server typecheck && yarn --cwd ui typecheck

prettier_fix:
	yarn prettier:fix

test:
	yarn --cwd server test

build:
	yarn workspaces foreach -p run build

ci: install lint typecheck test
