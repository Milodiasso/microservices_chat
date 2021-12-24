<?php
session_start();

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use GuzzleHttp\Client;
use Slim\Exception\HttpNotFoundException;

$client = new Client();

$app->post("/register", [AuthController::class, "register"]);
$app->post("/login", [AuthController::class, "login"]);
$app->get("/profil", [AuthController::class, "profil"]);

$app->group('/channel', function($app){
    $app->get('/', [ChatController::class, "channels"]); 
    $app->get('/chat/{channel}', [ChatController::class, "users"]);
    $app->put('/username', [ChatController::class, "put_username"]);
    $app->get("/name/{id_channel}", [ChatController::class, "show_msg"]);
    $app->get("/channel_master/{name_chat}", [ChatController::class, "master_channel"]);
    $app->post("/msg", [ChatController::class, "post_msg"]);
    $app->post("/create", [ChatController::class, "create_channel"]);
    $app->delete("/delete/{name_chat}", [ChatController::class, "delete_channel"]);
    $app->post("/add_user/{name_chat}", [ChatController::class, "add_user"]);
    $app->delete("/remove_user/{name_chat}", [ChatController::class, "remove_user"]);
    $app->put("/update_msg", [ChatController::class, "modify_msg"]);
    $app->delete("/delete_msg", [ChatController::class, "delete_msg"]);

    
});






$app->map(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], '/{routes:.+}', function ($request, $response) {
    return $response;
});