# microservices_chat

This is a chat without watchdog ou socket IO so it isn't update on sending message by another client

I used 2 API :
- Lumen/laravel to bound my database in MySQL with 'users' table and 'messages' table.
- NODEJS Express to bound my MONGODB database with one table 'channels'

Theese 2 API was triggered by another API to make sense on channel and users with messages on it.
The last API was maded with SLIM 'framework' and it was the strict minimum installed (guzzle & slim)

Finally I connected the slim API to my client (front) which I used ReactJS for it and AXIOS as main module.
