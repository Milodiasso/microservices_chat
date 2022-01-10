# microservices_chat

This is a chat without watchdog or socket IO so it isn't update on sending message by another client

I used 2 API :
- Lumen/laravel to bound my database in MySQL with 'users' table and 'messages' table.
- NODEJS Express to bound my MONGODB database with one table 'channels'

Theese 2 API was triggered by another API to make sense on channel and users with messages.
The last API was maded with SLIM 'framework' and the strict minimum  was installed to work (guzzle & slim)

Finally I connected the slim API to my client (front) which I used ReactJS and AXIOS as main module.
