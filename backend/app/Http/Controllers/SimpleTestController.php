<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SimpleTestController extends Controller
{
    public function test()
    {
        return response()->json(['message' => 'SimpleTestController working']);
    }
}
