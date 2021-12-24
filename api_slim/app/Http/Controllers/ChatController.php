<?php

namespace App\Http\Controllers;
// use Psr\Http\Message\ResponseInterface as Response;
// use Psr\Http\Message\ServerRequestInterface as Request;

class ChatController {
    public function users ($channel ) {
        global $client;
        $res = $client->request('GET', "http://localhost:3000/chat/" . $channel);
        return $res;
    }
    
    public function channels () {
        try {
            global $client;
            $res = $client->request("GET", "http://localhost:3000/channels"); 
            $res = $res->withHeader('Access-Control-Allow-Credentials', 'true');
            return $res;
        } catch (\Exception  $e) {
            return "someting is wrong ::::: " . $e;
        }
    }

    public function put_username($request){

        try {
            global $client;
            $body = json_decode($request->getBody());
            $header = $request->getHeaders();
            $res = $client->request("PUT", "http://localhost:8000/api/username", [
                'headers' => [
                    'Authorization' => $header['token'],
                ],
                "json" => [ "username" => $body->username, ]
            ]);
            return $res;
            

        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function show_msg( $id_channel){
        global $client;
        try {
            $res= $client->request("GET", "http://localhost:8000/channel/msg/".$id_channel);
            return $res;
            //code...
        } catch (\Throwable $th) {
            return $th;
        }

    }

    public function post_msg($request){

        try {
            global $client;
            $header = $request->getHeaders();
            $body = json_decode($request->getBody());
            if (!isset($body->content) || !isset($body->id_disc ) || strlen($header['token'][0])<15) return false;
            $res_post_msg = $client->request("POST", "http://localhost:8000/channel/msg",
                ['headers' => [
                    'Authorization' => $header['token'][0],
                    'Content-Type' => "application/json"
                ],
                "json" => [
                    "content" => $body->content,
                    "id_disc" => $body->id_disc
                ],
                
                
            ]);

            return $res_post_msg;

        } catch (\Exception $th) {
            throw $th;
        }
    }

    public function create_channel($request){
        global $client;
        try {
            $body = json_decode($request->getBody());
            $header = $request->getHeaders();
            if (!isset($body->name_chat) || strlen($header['token'][0])<15 || strlen($body->name_chat)<3 ) return false;
            $res_id_user = $client->request("GET", "http://localhost:8000/api/id", [
                "headers" => [
                    "Authorization" => $header['token'][0]
                ]
            ]);
            $res = $client->request('POST', "http://localhost:3000/create_chat", [
                "json" => [
                    "creatorId" => (string)$res_id_user->getBody(),
                    "nameChat" => $body->name_chat
                ]
            ]);
    
            return $res;
        } catch (\Throwable $th) {
            throw $th;
        }       
    }

    public function master_channel( $request, $name_chat){
        global $client;
        $header = $request->getHeaders();
        $res_id_master = $client->request('GET', "http://localhost:3000/channel_master", [
            "json" => [
                "nameChat" => $name_chat,
            ]
        ]);

        $id_master = json_decode((string)$res_id_master->getBody())[0];

        $res = $client->request('GET', "http://localhost:8000/api/authors/".$id_master, ["headers"=>["Authorization" => $header['token'][0]]]);
        
        return $res;
    }


    public function delete_channel( $request,  $name_chat){
        global $client;
        $header = $request->getHeaders();
        $res_id_user = $client->request("GET", "http://localhost:8000/api/id", [
            "headers" => [
                "Authorization" => $header['token'][0]
            ]
        ]);

        $res = $client->request('DELETE', "http://localhost:3000/channel", [
            "json" => [
                "idUser" => (string)$res_id_user->getBody(),
                "nameChat" => $name_chat,
            ]
        ]);
        
        return $res;
    }

    public function add_user($request,  $name_chat){
        global $client;
        $header = $request->getHeaders();
        $res_id_user = $client->request("GET", "http://localhost:8000/api/id", [
            "headers" => [
                "Authorization" => "Bearer " . $header['token'][0]
            ]
        ]);


        $res = $client->request('POST', "http://localhost:3000/add_user", [
            "json" => [
                "id" => (string)$res_id_user->getBody(),
                "channel" => $name_chat,
            ]
        ]);
        
        return $res;
    }

    public function remove_user( $request, $name_chat){
        global $client;
        $header = $request->getHeaders();
        $res_id_user = $client->request("GET", "http://localhost:8000/api/id", [
            "headers" => [
                "Authorization" => $header['token'][0]
            ]
        ]);


        $res = $client->request('DELETE', "http://localhost:3000/remove_user", [
            "json" => [
                "id" => (string)$res_id_user->getBody(),
                "channel" => $name_chat,
            ]
        ]);
        
        return $res;
    }

    public function modify_msg($request){
        global $client;
        $body = json_decode($request->getBody());
        $header = $request->getHeaders();
        $res = $client->request("PUT", "http://localhost:8000/channel/msg/". $body->id_msg, [
            "headers" => [
                "Authorization" => $header['token'][0]
            ],
            "json" => [
                "new_content" => $body->content
            ]
        ]);
        
        return $res;
    }

    public function delete_msg($request){
        global $client;
        $body = json_decode($request->getBody());
        $header = $request->getHeaders();
        $res = $client->request("DELETE", "http://localhost:8000/channel/msg/". $body->id_msg, [
            "headers" => [
                "Authorization" => $header['token'][0]
            ]
        ]);
        
        return $res;
    }
    
}
