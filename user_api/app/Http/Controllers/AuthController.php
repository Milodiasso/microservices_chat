<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Users;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login','register']]);
    }

    /**
     * Store a new user.
     *
     * @param  Request  $request
     * @return Response
     */
    public function register(Request $request)
    {
        //validate incoming request 
        $this->validate($request, [
            'login' => 'required|string|unique:users',
            'password' => 'required|confirmed',
        ]);

        try 
        {
            $user = new Users;
            $user->login= $request->input('login');
            $user->password = app('hash')->make($request->input('password'));
            $user->save();

            return response()->json( [
                        'entity' => 'users', 
                        'action' => 'create', 
                        'result' => 'success'
            ], 201);

        } 
        catch (\Exception $e) 
        {
            return response()->json( [
                       'entity' => 'users', 
                       'action' => 'create', 
                       'result' => 'failed'
            ], 409);
        }
    }
	
     /**
     * Get a JWT via given credentials.
     *
     * @param  Request  $request
     * @return Response
     */	 
    public function login(Request $request)
    {

        try {
            //code...
            //validate incoming request 
          $this->validate($request, [
              'login' => 'required|string',
              'password' => 'required|string'
          ]);
  
          $credentials = $request->only(['login', 'password']);
  
          if (! $token = Auth::attempt($credentials)) {			
              return response()->json(['message' => 'Unauthorized'], 401);
          }
          return $this->respondWithToken($token);
        } catch (\Exception $e) {
            return 'wrong : ' . $e;
        }
    }

    /**
     * 
     * @param Request $request
     * @return Response
     */
    public function username(Request $request){
        try {
            $id= response()->json(auth()->id());
            $id = $id->original; 
            $user = Users::findOrFail($id);
            $user->username = $request->input('username');
            $user->save();
            return response("username saved",201);
        } catch (\Exception $e) {
            return response("error catched: $e", 409);
        }

    }


     /**
     * Get user details.
     *
     * @param  Request  $request
     * @return Response
     */	 	
    public function me()
    {
        return response()->json(auth()->id());
    }

    public function showAllUsers()
    {
        return response()->json(Users::all());
    }

    public function showOneUser($id)
    {
        return response()->json(Users::find($id));
    }


    public function update($id, Request $request)
    {

        $author = Users::findOrFail($id);
        $request['password']= app('hash')->make($request->input('password'));
        $author->update($request->all());

        return response()->json($author, 200);
    }

    public function delete($id)
    {
        Users::findOrFail($id)->delete();
        return response('Deleted Successfully', 200);
    }

}