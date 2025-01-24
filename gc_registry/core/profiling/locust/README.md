## 1. Install Locust for Load Testing
``` 
poetry add locust --group dev
``` 
## 2. Run Scalability Testing
1. Run the backend container
```
make dev
``` 

2. Seed data
Seed data to the DB
```
make db.seed
```

2. Run the frontend container (Not implemented)
```
npm run start.docker
``` 
3. Start Locust
``` 
locust -f gc_registry\core\profiling\locust\run_scenario.py
``` 
4. Open Locust Web UI
``` 
http://localhost:8089
``` 
5. Start the load test

### Important
Make sure to reset the db if you are running it locally or change the seeded data before running a second test because some of the newly generated devices and certrificates will fail as already existing.