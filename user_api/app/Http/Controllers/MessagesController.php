<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Users;
use App\Models\Messages;

class MessagesController extends Controller
{
    /**
     * @param Request $request
     * @return Response
     * 
     */
    public function postMsg(Request $request){
        try {
            $id= response()->json(auth()->id());
            if (!$id) return "no token found";
            $id = $id->original; 
            $user = Users::findOrFail($id);
    
            if( !isset($user->username) || $user->username == null){
                return "No username registered";
            }
    
            $msg = new Messages;
            $msg->id_user = $id;
            $msg->content = $request->input("content");
            $msg->id_discussion = $request->input("id_disc");
            $msg->save();
    
            return response()->json([
                "sended" => "success",
                "id_msg" => $msg->id
            ]);
        } catch (\Throwable $th) {
            return "error part !" . " _____" . $th;
        }

    }

    /**
     * @return Response
     */
    public function allMsgChan(Request $request, $id_channel){
        $msg = Messages::select('messages.id','username', 'content' ,'messages.created_at')
            ->join('users', 'messages.id_user', '=', 'users.id')
            ->where("id_discussion", $id_channel )
            ->get();
        return response()->json($msg);

    }

    /**
     * @param Request $request
     * @return Response
     */
    public function updateMsg(Request $request, $id){

        try {
            $id_user = response()->json(auth()->id());
            $id_user = $id_user->original; 
            $update = Messages::where("id_user", $id_user)
                ->where("id", $id)
                ->update(['content'=>$request->input('new_content')]);

            if ($update){
                return response("Table messages -> id : $id" );
            }
            return response("can't update another message than yours");
        } catch (\Throwable $th) {
            throw $th;
        }
    }



    /**
     * @param Request $request
     * @return Response
     */
    public function delMsg(Request $request, $id){
        $id_user = response()->json(auth()->id());
        $id_user = $id_user->original; 
        $delete = Messages::where("id_user", $id_user)
            ->where("id", $id)
            ->delete();
        if ($delete) return response("Table messages -> id : $id has been deleted");
        return response(0);
    }
    

}