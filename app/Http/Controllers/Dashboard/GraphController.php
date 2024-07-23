<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GraphController extends Controller
{
    public function create(Request $request){
       return Inertia::render('Dashboard/Dashboard');
    }
}
