<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class TestSessionController
{
    public function test(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'TestSessionController is working'
        ]);
    }
}
