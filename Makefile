install:
	docker-compose -f docker-compose-install.yml up --build

start:
	docker-compose up --build --force-recreate

stop:
	docker-compose stop

lint:
	yarn lint

clean:
	docker-compose kill && docker system prune --force --volumes

ci: install lint
