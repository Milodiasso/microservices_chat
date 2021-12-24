<?php
use DI\Container;
use DI\Bridge\Slim\Bridge as SlimAppFactory;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Routing\RouteContext;
// use Tuupola\Middleware\CorsMiddleware;



require __DIR__ . '/../vendor/autoload.php';

$container = new Container;

$settings = require __DIR__ . "/../app/settings.php";
$settings($container);

$app = SlimAppFactory::create($container);



#$app->pipe(ImplicitOptionsMiddleware::class);
    // $app->pipe(CorsMiddleware::class);

// $app->add(new CorsMiddleware);

// $app->add(new CorsMiddleware([
//     "origin" => ["*"],
//     "methods" => ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
//     "headers.allow" => [],
//     "headers.expose" => [],
//     "credentials" => false,
//     "cache" => 0,
// ]));

$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization, token, Content-Length', )
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});



$middleware = require __DIR__ . "/../app/middleware.php";
$middleware($app);

$route = require __DIR__ . "/../app/routes.php";
// $app->options('/{routes:.+}', function ($request, $response, $args) {
//     return $response;
// });

$app->run();