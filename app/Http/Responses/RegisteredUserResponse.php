<?php

namespace App\Http\Responses;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\RegisteredUserResponse as RegisteredUserResponseContract;

class RegisteredUserResponse implements RegisteredUserResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();

        if ($user instanceof User && $user->status !== 'active') {
            auth()->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->with('status', 'Your registration has been submitted and is awaiting approval by an administrator.');
        }

        return redirect(config('fortify.home', '/dashboard'));
    }
}
