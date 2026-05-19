<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('teacher/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia::render('teacher/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "f_name" => "required|string|max:50",
            "l_name" => "required|string|max:50",
            "subject" => "required|string|max:50",
        ]);

        $validated['tenant_id'] = Auth::user()->tenant_id;
        Teacher::create([
            'tenant_id' => $validated['tenant_id'],
            'first_name' => $validated['f_name'],
            'last_name' => $validated['l_name'],
            'subject' => $validated['subject'],
        ]);
        return to_route('teacher.index')->with([
            'type' => 'success',
            'message' => 'Teacher added successfully',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
