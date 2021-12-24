<?php

/** @var \Laravel\Lumen\Routing\Router $router */


/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/


$router->group(['middleware' => 'auth','prefix' => 'api'], function ($router) 
{
    $router->get('me', 'AuthController@me');
});

$router->group(['prefix' => 'api'], function () use ($router) 
{
   $router->post('register', 'AuthController@register');
   $router->post('login', 'AuthController@login');
   $router->put('username', 'AuthController@username');
      
   $router->get('authors/', ['uses' => 'AuthController@showAllUsers']);
   $router->get('id', ['uses' => 'AuthController@me']);

   $router->get('authors/{id}', ['uses' => 'AuthController@showOneUser']);

   $router->delete('authors/{id}', 'AuthController@delete');

   $router->put('authors/{id}', ['uses' => 'AuthController@update']);
});

$router->group(['prefix' => 'channel'], function () use($router){
    $router->get('msg/{id_channel}', "MessagesController@allMsgChan");
    $router->post('msg', "MessagesController@postMsg");
    $router->put('msg/{id}', "MessagesController@updateMsg");
    $router->delete('msg/{id}', "MessagesController@delMsg");
});



