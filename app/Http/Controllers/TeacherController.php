<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;
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
            "f_name" => "required| max:50",
            "l_name" => "required| max:50",
            "subject" => "required| max:50",

        ]);

        

        $teacher = new Teacher;
        $teacher->tenant_id = 1;
        $teacher->first_name = $request->f_name;
        $teacher->last_name = $request->l_name;
        $teacher->subject = $request->subject;
        $teacher->save();
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
