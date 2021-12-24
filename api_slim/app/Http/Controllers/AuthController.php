<?php
namespace App\Http\Controllers;


class AuthController {

    public function register ($request, $response) {
        global $client;
            $body = json_decode($request->getBody());
            if (!isset($body->login) || !isset($body->password) || !isset($body->password_confirmation)  ){
                $response->getBody()->write('bad');
                return $response; 
            } elseif (strlen($body->login) <3 || strlen($body->password) < 6  || strlen($body->password_confirmation)<6 ){
                $response->getBody()->write('login 3+ pass 6+');
                return $response; 
            } 

            if($body->password != $body->password_confirmation  ){
                $response->getBody()->write('pass and confirm must be the same');
                return $response; 
            }

            $res = $client->request("POST", "http://localhost:8000/api/register", ['json'=>[
                "login" => $body->login,
                "password" => $body->password,
                "password_confirmation" => $body->password_confirmation
    
                ]
            ]);
            return $res;


    }


    public function login ( $request, $response){
        global $client;
        $body = json_decode($request->getBody());
        if (!isset($body->login) || !isset($body->password)){
            $response->getBody()->write('bad');
            return $response; 
        } elseif (strlen($body->login) <1 || strlen($body->password) < 1 ){
            $response->getBody()->write('complete!');
            return $response; 
        }
        try {
            $res = $client->request("POST", "http://localhost:8000/api/login", ["json" => [
                "login" => $body->login,
                "password" => $body->password,
                ]
            ]);
            $response->getBody()->write(json_decode((string)$res->getBody())->token);
            return $response;

        } catch (\Throwable $th) {
            $response->getBody()->write("wrong login or password");
            return $response;

        }
    }

    public function profil($request, $response){
        global $client;
        // var_dump($request);
        $header = $request->getHeaders();
        // $response->getBody()->write($header);
        // return $response;
        $res_id = $client->request("GET", "http://localhost:8000/api/id",["headers"=>[
            "Authorization" => $header['token']
            ]
        ]);
        sleep(1);
        $id = (string)$res_id->getBody();

        $res = $client->request("GET", "http://localhost:8000/api/authors/".$id,
        ["headers"=>[
            "Authorization" => $header['token']
        ]
        ]);
        // $response->getBody()->write(  (string)$res->getBody());
        return $res;
    }


}