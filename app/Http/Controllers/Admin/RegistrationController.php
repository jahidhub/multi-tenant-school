<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegistrationController extends Controller
{
    public function index()
    {
        $pending = User::withoutGlobalScopes()
            ->where('status', 'pending')
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/registrations/Index', [
            'registrations' => $pending,
        ]);
    }

    public function approve(Request $request, User $user)
    {
        $user->update([
            'status' => 'active',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return back()->with('success', 'Registration approved.');
    }

    public function reject(Request $request, User $user)
    {
        $user->update([
            'status' => 'rejected',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return back()->with('success', 'Registration rejected.');
    }
}
