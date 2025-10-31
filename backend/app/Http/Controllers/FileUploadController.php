<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class FileUploadController extends Controller
{
    /**
     * Upload profile image
     */
    public function uploadProfileImage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid image file',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $image = $request->file('image');
            $filename = 'profile-images/' . Str::uuid() . '.' . $image->getClientOriginalExtension();

            // Upload using environment-specific disk
            $disk = config('filesystems.uploads');
            $path = Storage::disk($disk)->put($filename, file_get_contents($image));

            // Generate URL using disk configuration
            $diskConfig = config("filesystems.disks.{$disk}");
            $url = rtrim($diskConfig['url'], '/') . '/' . $filename;

            // Update user profile image
            $user = auth()->user();
            $user->profile_image = $url;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Profile image uploaded successfully',
                'data' => [
                    'url' => $url,
                    'user' => $user
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Upload lesson media (audio/video)
     */
    public function uploadLessonMedia(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'media' => 'required|file|mimes:mp3,mp4,wav,webm|max:51200', // 50MB max
            'type' => 'required|in:audio,video',
            'lesson_id' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid media file',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $media = $request->file('media');
            $type = $request->type;
            $lessonId = $request->lesson_id ?? 'temp';

            $filename = "lessons/{$type}/{$lessonId}/" . Str::uuid() . '.' . $media->getClientOriginalExtension();

            // Upload using environment-specific disk
            $disk = config('filesystems.uploads');
            $path = Storage::disk($disk)->put($filename, file_get_contents($media));

            // Generate URL using disk configuration
            $diskConfig = config("filesystems.disks.{$disk}");
            $url = rtrim($diskConfig['url'], '/') . '/' . $filename;

            return response()->json([
                'success' => true,
                'message' => 'Media uploaded successfully',
                'data' => [
                    'url' => $url,
                    'filename' => $filename,
                    'type' => $type,
                    'size' => $media->getSize(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Upload general files
     */
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:51200', // 50MB max
            'folder' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid file',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('file');
            $folder = $request->folder ?? 'uploads';

            $filename = "{$folder}/" . Str::uuid() . '.' . $file->getClientOriginalExtension();

            // Upload using environment-specific disk
            $disk = config('filesystems.uploads');
            $path = Storage::disk($disk)->put($filename, file_get_contents($file));

            // Generate URL using disk configuration
            $diskConfig = config("filesystems.disks.{$disk}");
            $url = rtrim($diskConfig['url'], '/') . '/' . $filename;

            return response()->json([
                'success' => true,
                'message' => 'File uploaded successfully',
                'data' => [
                    'url' => $url,
                    'filename' => $filename,
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
