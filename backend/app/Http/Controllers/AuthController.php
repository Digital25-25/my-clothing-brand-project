<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    public function register(Request $r){
        $validate = $r->validate([
            'name' => 'required|min:5|max:150',
            'email' => 'required|max:150|unique:users,email',
            'password' => 'required|min:8|max:250',
            'phone' => 'required|regex:/^[0-9+\-\s()]+$/',
        ]);

        $user = User::create($validate);
        Auth::login($user);

        return response()->json([
            "success" => true,
        ], 201);
    }
    public function logout(Request $r){

        Auth::logout();

        $r->session()->invalidate(); /* Delete the current user's session and forget everything stored in it */
        $r->session()->regenerateToken(); /* Create a fresh CSRF token so future forms remain protected. */

        return response()->json([
            "sucess" => true
        ]);
    }   
    public function login(Request $r){
        $credential = $r->validate([
            'email' => 'required|email|max:150|regex:/^[^@\s]+@[^@\s]+\.[^@\s]+$/',
            'password' => 'required|min:8|max:250'
        ]);
        if (!Auth::attempt($credential)){
            return response()->json([
                "success" => false, 
                "message" => "Invalid credentials"
            ], 401);
        }
        $r->session()->regenerate(); /* Create a new session id */
        return response()->json([
            "success" => true,
            "user" => Auth::user()
            ]);
            

    }
}
/* W_O_R_K_i_N_G _ON_ A_U_T_H_E_N_T_I_C_A_T_I_O_N

    WHAT I AM DOING HERE 
    IF THE USER(ADMIN OR CUSTOMER) LOGIN  
    WE SHOULD RETURN A PAGE IN REACT RELATING TO THAT USER
    WHEN LOGIN, ONLY THE LOGOUT BUTTON SHOULD BE DISPLAY.
    WHEN LOGOUT, ONLY THE LOGIN ROUTE SHOULD BE AVAILABLE. 

    REACT + LARAVEL 
*/