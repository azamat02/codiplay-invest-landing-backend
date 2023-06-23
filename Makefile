stop:
	docker-compose down
clear_containers:
	docker rm $(docker ps -q -a)
clear_images:
	docker rmi $(docker images -q)
compose:
	docker-compose -f node-compose.yaml up -docker
compose-2:
	docker-compose up -d
run:
	make compose && make compose-2